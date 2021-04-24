import { UsersApiService } from './../../services/users.api.service';
import { BaseComponent } from '../../shared/base.component';
import { Injectable, OnDestroy } from '@angular/core';
import { PostsApiService } from '../../services/posts.api.service';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { PagedData } from '../../shared/models/common';
import {
  PostViewModel,
  PostCmd,
  GetVoteDto,
  GetPostDtoEx,
  VoteType,
  UserActionOnPost,
  postCategories,
  GetPostDto,
} from '../models';
import { SidebarNavigation } from '../../sidebar/sidebar-view.models';
import { AuthState } from '../../store/auth/auth.reducer';
import { Store, select } from '@ngrx/store';
import { UserViewModel } from '../../users/user-view-models';
import { withLatestFrom, take, takeUntil } from 'rxjs/operators';
import { userProfile } from '../../store/auth/auth.selectors';
import { EnvironmentService } from '../../services/environment.service';
import { LoadingService } from '../../services/loading.service';
import { SnackbarService } from '../../services/snackbar.service';
import { BaseService } from '../../shared/models/base.service';
import { VotesService } from '../../services/votes.service';
import { AuthService } from '../../services/auth.service';
import { User, UserRole } from '../../users/user';
import * as moment from 'moment';
import { cloneDeep } from 'lodash';

@Injectable()
export class PostsService extends BaseService<PostCmd> implements OnDestroy {
  private _postsSubject = new BehaviorSubject<PagedData<PostViewModel>>(null);
  private _postSubject = new Subject<PostViewModel>();
  private _posts: PostViewModel[] = [];
  private _total: number;
  private _post: PostViewModel;
  private _user: UserViewModel;
  private _noMorePosts: boolean;

  isEditSuccessful: boolean;
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
    private snackbarService: SnackbarService,
    private votesService: VotesService,
    private authService: AuthService,
    private usersApiService: UsersApiService,
  ) {
    super(environmentService);
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
    } catch ({ error }) {
      this.snackbarService.showWarn('Get Posts Failed ' + error.message);
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
    } catch ({error}) {
      this.snackbarService.showWarn('Get Post Failed ' + error.message);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  create(cmd: PostCmd): Promise<void> {
    throw new Error('Method not implemented.');
  }

  edit(cmd: PostCmd, id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  clear(): void {
    this._posts = [];
    this._noMorePosts = false;
    this.paging.skip = 0;
    this._total = null;
  }

  private async getUserVotes(posts: GetPostDto[]): Promise<GetVoteDto[]> {
    if (!this.authService.isLoggedIn()) {
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
      vote: votes.find(v => v.postId === post.id),
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
