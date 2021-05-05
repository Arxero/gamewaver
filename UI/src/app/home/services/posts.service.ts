import { AuthService } from './../../auth/auth.service';
import { UsersApiService } from './../../services/users.api.service';
import { Injectable, OnDestroy } from '@angular/core';
import { PostsApiService } from '../../services/posts.api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { PagedData, SnackbarErrors } from '../../shared/models/common';
import {
  PostViewModel,
  PostCmd,
  GetVoteDto,
  GetPostDtoEx,
  UserActionOnPost,
  postCategories,
  GetPostDto,
  PostContext,
  VoteType,
  GetVotesCountDto,
} from '../models';
import { UserViewModel } from '../../users/user-view-models';
import { takeUntil } from 'rxjs/operators';
import { EnvironmentService } from '../../services/environment.service';
import { LoadingService } from '../../services/loading.service';
import { SnackbarService } from '../../services/snackbar.service';
import { BaseService } from '../../shared/models/base.service';
import { VotesApiService } from '../../services/votes.api.service';
import { AuthApiService } from '../../services/auth.api.service';
import { User, UserRole } from '../../users/user';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { isEmpty } from 'lodash';

@Injectable()
export class PostsService extends BaseService<PostCmd> implements OnDestroy {
  private _postsSubject = new BehaviorSubject<PagedData<PostViewModel>>(null);
  private _postSubject = new BehaviorSubject<PostViewModel>(null);
  private _posts: PostViewModel[] = [];
  private _post: PostViewModel;
  private _total: number;
  private _user: UserViewModel;
  private _noMorePosts: boolean;

  postContext: PostContext;
  action: UserActionOnPost = UserActionOnPost.Posted;

  get posts$(): Observable<PagedData<PostViewModel>> {
    return this._postsSubject.asObservable();
  }

  get post$(): Observable<PostViewModel> {
    return this._postSubject.asObservable();
  }

  get isPosts(): boolean {
    return this._posts.length > 0;
  }

  constructor(
    private postsApiService: PostsApiService,
    private loadingService: LoadingService,
    environmentService: EnvironmentService,
    snackbarService: SnackbarService,
    private votesApiService: VotesApiService,
    private authApiService: AuthApiService,
    private usersApiService: UsersApiService,
    private router: Router,
    private authService: AuthService,
  ) {
    super(environmentService, snackbarService);
    this.authService.profile$.pipe(takeUntil(this.destroyed$)).subscribe(x => (this._user = x));
  }

  async getMany(): Promise<void> {
    if (this._noMorePosts) {
      return;
    }

    try {
      this.loadingService.setUILoading();
      const posts = (await this.postsApiService.findAll(this.paging, this.filter, this.sort)).result;
      const votes = await this.getUserVotes(posts.items);
      const mappedPosts = posts.items.map(p => this.mapPostEx(p, votes));
      this._posts = this._posts.concat(mappedPosts);
      this.paging.skip = this._posts.length;
      this._total = posts.total;
      this._noMorePosts = this._posts.length === this._total;
      this._postsSubject.next({ items: this._posts, total: this._total });
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.GetPosts);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  async getOne(id: string): Promise<void> {
    const foundPost = this._posts.find(x => x.id === id);
    if (foundPost) {
      this._postSubject.next(foundPost);
      return;
    }

    try {
      this.loadingService.setUILoading();
      const post = (await this.postsApiService.findOne(id)).result;
      const author = (await this.usersApiService.findOne(post.authorId)).result;
      const votes = await this.getUserVotes([post]);
      const votesCount = (await this.votesApiService.findCountByPostId([post.id])).result[0];
      const mappedPostEx = this.mapPost(post, author, votesCount);
      this._post = this.mapPostEx(mappedPostEx, votes);
      this._postSubject.next(this._post);
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.GetPost);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  async create(cmd: PostCmd): Promise<void> {
    try {
      this.loadingService.setUILoading();
      const post = (await this.postsApiService.create(cmd)).result;
      const mappedPost = this.mapPostEx(this.mapPost(post, this._user));
      this._posts.unshift(mappedPost);
      this._postsSubject.next({ items: this._posts, total: this._total++ });
      this.snackbarService.showInfo('Post Added Successfully');
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.CreatePost);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  async edit(cmd: PostCmd, id: string): Promise<void> {
    try {
      this.loadingService.setUILoading();
      const post = (await this.postsApiService.update(id, cmd)).result;
      const author = (await this.usersApiService.findOne(post.authorId)).result;
      const mappedPost = this.mapPostEx(this.mapPost(post, author));
      const i = this._posts.findIndex(x => x.id === id);
      this._posts.splice(i, 1, mappedPost);
      this._postSubject.next(mappedPost);
      this._postsSubject.next({ items: this._posts, total: this._total });
      this.snackbarService.showInfo('Post Edited Successfully');
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.EditPost);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.loadingService.setUILoading();
      await this.postsApiService.delete(id);
      const i = this._posts.findIndex(x => x.id === id);
      this._posts.splice(i, 1);
      this._postsSubject.next({ items: this._posts, total: this._total-- });
      this.snackbarService.showInfo('Post Deleted Successfully');

      if (this.postContext === PostContext.PostPage) {
        this.router.navigateByUrl('/');
      }
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.DeletePost);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  clear(): void {
    this._posts = [];
    this._noMorePosts = false;
    this.paging.skip = 0;
    this._total = null;
    this.action = null;
    this._post = null;
  }

  updateVote(vote: GetVoteDto, isDelete?: boolean): void {
    let post = { ...this._posts.find(x => x.id === vote.postId) };

    // when we load directly from post page
    if (isEmpty(post)) {
      post = { ...this._post };
    }

    if (vote.type === VoteType.Upvote && !isDelete) {
      post.upvotes++;
    } else if (vote.type === VoteType.DownVote && !isDelete) {
      post.downvotes++;
    } else if (vote.type === VoteType.Upvote && isDelete) {
      post.upvotes--;
    } else if (vote.type === VoteType.DownVote && isDelete) {
      post.downvotes--;
    }

    post.vote = isDelete ? null : vote;
    const i = this._posts.findIndex(x => x.id === vote.postId);
    this._posts.splice(i, 1, post);
    this._post = post;
    this._postSubject.next(this._post);
    this._postsSubject.next({ items: this._posts, total: this._total });
  }

  updateComment(postId: string, isDelete?: boolean): void {
    const post = { ...this._posts.find(x => x.id === postId) };
    if (isEmpty(post)) {
      return;
    }

    if (isDelete) {
      post.comments--;
    } else {
      post.comments++;
    }
    const i = this._posts.findIndex(x => x.id === postId);
    this._posts.splice(i, 1, post);
    this._postsSubject.next({ items: this._posts, total: this._total });
  }

  private async getUserVotes(posts: GetPostDto[]): Promise<GetVoteDto[]> {
    if (!this.authApiService.isLoggedIn()) {
      return;
    }

    const postdIds = posts.map(x => x.id);
    return (await this.votesApiService.findManyByPostId(postdIds)).result;
  }

  private mapPost(post: GetPostDto, author: User, votesCount?: GetVotesCountDto): GetPostDtoEx {
    return {
      ...post,
      upvotes: votesCount?.upvotes || 0,
      downvotes: votesCount?.downvotes || 0,
      comments: 0,
      role: author.role,
      avatar: author.avatar,
      username: author.username,
    } as GetPostDtoEx;
  }

  private mapPostEx(post: GetPostDtoEx, votes?: GetVoteDto[]): PostViewModel {
    return {
      ...post,
      date: this.getPostDate(post),
      tooltipDate: moment(this.getPostDate(post)).format('MMMM DD, YYYY [at] hh:mm A'),
      userRole: post.role !== UserRole.USER ? post.role : null,
      categoryLabel: postCategories.find(j => j.value === post.category).label,
      userActionOnPost: this.action,
      vote: votes?.find(v => v.postId === post.id),
    };
  }

  private getPostDate(post: GetPostDtoEx): string {
    let date: Date;
    switch (this.action) {
      case UserActionOnPost.Commented:
        date = post.commentCreated;
        break;
      case UserActionOnPost.Voted:
        date = post.voteCreated;
        break;
      default:
        date = post.createdAt;
        break;
    }

    return date.toString();
  }
}
