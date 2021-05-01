import { UsersApiService } from './../../services/users.api.service';
import { Injectable, OnDestroy } from '@angular/core';
import { PostsApiService } from '../../services/posts.api.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
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
} from '../models';
import { AuthState } from '../../store/auth/auth.reducer';
import { Store, select } from '@ngrx/store';
import { UserViewModel } from '../../users/user-view-models';
import { takeUntil } from 'rxjs/operators';
import { userProfile } from '../../store/auth/auth.selectors';
import { EnvironmentService } from '../../services/environment.service';
import { LoadingService } from '../../services/loading.service';
import { SnackbarService } from '../../services/snackbar.service';
import { BaseService } from '../../shared/models/base.service';
import { VotesApiService } from '../../services/votes.api.service';
import { AuthApiService } from '../../services/auth.api.service';
import { User, UserRole } from '../../users/user';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Injectable()
export class PostsService extends BaseService<PostCmd> implements OnDestroy {
  private _postsSubject = new BehaviorSubject<PagedData<PostViewModel>>(null);
  private _postSubject = new Subject<PostViewModel>();
  private _posts: PostViewModel[] = [];
  private _total: number;
  private _user: UserViewModel;
  private _noMorePosts: boolean;

  postContext: PostContext;
  action: UserActionOnPost;

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
    private store: Store<AuthState>,
    private postsApiService: PostsApiService,
    private loadingService: LoadingService,
    environmentService: EnvironmentService,
    snackbarService: SnackbarService,
    private votesService: VotesApiService,
    private authApiService: AuthApiService,
    private usersApiService: UsersApiService,
    private router: Router,
  ) {
    super(environmentService, snackbarService);
    this.store.pipe(takeUntil(this.destroyed$), select(userProfile)).subscribe(x => {
      this._user = x;
    });
  }

  async getMany(): Promise<void> {
    if (this._noMorePosts) {
      return;
    }

    try {
      this.loadingService.setUILoading();
      const posts = (await this.postsApiService.findAll(this.paging, this.filter, this.sort)).result;
      const votes = await this.getUserVotes(posts.items);
      const mappedPosts = posts.items.map(p => this.mapPost(p, votes));
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
      const mappedPost = this.mapPost(post as GetPostDtoEx, votes, author);
      this._postSubject.next(mappedPost);
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
      const mappedPost = this.mapPost(post as GetPostDtoEx, [], this._user);
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
      const mappedPost = this.mapPost(post as GetPostDtoEx, [], this._user);
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
  }

  updateVote(vote: GetVoteDto, isDelete?: boolean): void {
    const post = this._posts.find(x => x.id === vote.postId);

    if (!post) {
      return;
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
    this._postsSubject.next({ items: this._posts, total: this._total });
  }

  private async getUserVotes(posts: GetPostDto[]): Promise<GetVoteDto[]> {
    if (!this.authApiService.isLoggedIn()) {
      return;
    }

    const postdIds = posts.map(x => x.id);
    return (await this.votesService.findManyByPostId(postdIds)).result;
  }

  private mapPost(post: GetPostDtoEx, votes: GetVoteDto[], author?: User): PostViewModel {
    return {
      id: post.id,
      content: post.content,
      authorId: post.authorId,
      avatar: post.avatar ? post.avatar : author?.avatar,
      username: post.username ? post.username : author.username,
      date: this.getPostDate(post),
      tooltipDate: moment(this.getPostDate(post)).format('MMMM DD, YYYY [at] hh:mm A'),
      userRole: post.role ? this.isNotUserRole(post.role) : this.isNotUserRole(author.role),
      category: post.category,
      categoryLabel: postCategories.find(j => j.value === post.category).label,
      userActionOnPost: this.action,
      upvotes: post.upvotes || 0,
      downvotes: post.downvotes || 0,
      comments: post.comments || 0,
      vote: votes?.find(v => v.postId === post.id),
    };
  }

  private getPostDate(post: GetPostDtoEx): string {
    let date: Date;
    switch (this.action) {
      case UserActionOnPost.Posted:
        date = post.createdAt;
        break;
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

  // to be refactored after other stuff here are done
  private isNotUserRole = (role: UserRole): UserRole | null => {
    return role !== UserRole.USER ? role : null;
  };
}
