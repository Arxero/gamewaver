import { GetPostDtoEx, GetPostDto } from './../../home/models/home.models';
import { homeStatePosts } from './home.selectors';
import { AuthService } from './../../services/auth.service';
import { VotesService } from './../../services/votes.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, withLatestFrom } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { HomeState } from './home.reducer';
import { PostsApiService } from '../../services/posts.api.service';
import {
  HomeActionTypes,
  CreatePostAction,
  CreatePostActionSuccess,
  GetPostsAction,
  GetPostsActionSuccess,
  DeletePostAction,
  DeletePostActionSuccess,
  GetPostAction,
  GetPostActionSuccess,
  EditPostAction,
  EditPostActionSuccess,
  CreatePostUpvoteAction,
  CreatePostUpvoteActionSuccess,
  DeletePostUpvoteAction,
  DeletePostUpvoteActionSuccess,
} from './home.actions';
import { SnackbarService } from '../../services/snackbar.service';
import { UsersApiService } from '../../services/users.api.service';
import { DataFilter, SearchType } from '../../shared/models/common';
import {
  mapPostViewModel,
} from '../../home/models/post-view-model';
import { AuthState } from '../auth/auth.reducer';
import { userProfile } from '../auth/auth.selectors';
import { Router } from '@angular/router';
import { CommentsApiService } from '../../services/comments.api.service';
import {
  UserActionOnPost,
  PostContext,
  PostViewModel,
} from '../../home/models/home-view-model';
import { LoadingService } from '../../services/loading.service';

@Injectable()
export class HomeEffects {
  constructor(
    private actions$: Actions,
    private store: Store<HomeState>,
    private storeAuth: Store<AuthState>,
    private snackbarService: SnackbarService,
    private postsService: PostsApiService,
    private usersApiService: UsersApiService,
    private commentsService: CommentsApiService,
    private loadingService: LoadingService,
    private votesService: VotesService,
    private authService: AuthService,
    private router: Router,
  ) {}

  // CREATE POST
  @Effect({ dispatch: false })
  createPost$ = this.actions$.pipe(
    ofType<CreatePostAction>(HomeActionTypes.CreatePostAction),
    withLatestFrom(this.storeAuth.pipe(select(userProfile))),
    tap(async a => {
      try {
        const user = a[1];
        this.loadingService.setUILoading();
        const { result } = await this.postsService.create(a[0].payload.cmd);
        const data = mapPostViewModel(result as GetPostDtoEx, user);
        this.store.dispatch(new CreatePostActionSuccess({ data }));
      } catch (error) {
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  createPostSuccess$ = this.actions$.pipe(
    ofType<CreatePostActionSuccess>(HomeActionTypes.CreatePostActionSuccess),
    tap(() => {
      this.loadingService.setUILoading(false);
      this.snackbarService.showInfo('Post Added Successfully');
    }),
  );

  // EDIT POST
  @Effect({ dispatch: false })
  editPost$ = this.actions$.pipe(
    ofType<EditPostAction>(HomeActionTypes.EditPostAction),
    tap(async a => {
      try {
        this.loadingService.setUILoading();
        this.store.dispatch(new EditPostActionSuccess({ id: a.payload.id }));
      } catch (error) {
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  editPostSuccess$ = this.actions$.pipe(
    ofType<EditPostActionSuccess>(HomeActionTypes.EditPostActionSuccess),
    tap(a => {
      this.loadingService.setUILoading(false);
      this.snackbarService.showInfo('Post Edited Successfully');
      this.store.dispatch(new GetPostAction({ id: a.payload.id }));
    }),
  );

  // GET POSTS
  @Effect({ dispatch: false })
  getPosts$ = this.actions$.pipe(
    ofType<GetPostsAction>(HomeActionTypes.GetPostsAction),
    tap(async a => {
      try {
        this.loadingService.setUILoading();
        const { result } = await this.postsService.findAll(
          a.payload.paging,
          a.payload.filters,
          a.payload.sorting,
        );

        const postIds = result.items.map(x => x.id);
        const userVotesPerPosts = this.authService.isLoggedIn()
          ? await this.votesService.findManyByPostId(postIds)
          : null;
        const posts: PostViewModel[] = result.items.map(post => {
          return mapPostViewModel(
            post,
            null,
            userVotesPerPosts?.result.find(x => x.postId === post.id),
            a.payload.userActionOnPost,
          );
        });

        this.store.dispatch(
          new GetPostsActionSuccess({
            data: { items: posts, total: result.total },
          }),
        );
      } catch (error) {
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  getPostsSuccess$ = this.actions$.pipe(
    ofType<GetPostsActionSuccess>(HomeActionTypes.GetPostsActionSuccess),
    tap(() => {
      this.loadingService.setUILoading(false);
    }),
  );

  // DELETE POST
  @Effect({ dispatch: false })
  deletePost$ = this.actions$.pipe(
    ofType<DeletePostAction>(HomeActionTypes.DeletePostAction),
    tap(async a => {
      try {
        this.loadingService.setUILoading();
        this.store.dispatch(
          new DeletePostActionSuccess({
            id: a.payload.id,
            postContext: a.payload.postContext,
          }),
        );
      } catch (error) {
        this.snackbarService.showWarn('Post Deletion Failed');
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  deletePostSuccess$ = this.actions$.pipe(
    ofType<DeletePostActionSuccess>(HomeActionTypes.DeletePostActionSuccess),
    tap(a => {
      this.loadingService.setUILoading(false);
      this.snackbarService.showInfo('Post Deleted Successfully');
      if (a.payload.postContext === PostContext.PostPage) {
        this.router.navigateByUrl('/');
      }
    }),
  );

  // GET POST
  @Effect({ dispatch: false })
  getPost$ = this.actions$.pipe(
    ofType<GetPostAction>(HomeActionTypes.GetPostAction),
    withLatestFrom(this.storeAuth.pipe(select(homeStatePosts))),
    tap(async ([a, posts]) => {
      try {
        const foundPost = posts?.items.find(x => x.id === a.payload.id);
        if (foundPost) {
          this.store.dispatch(new GetPostActionSuccess({ data: foundPost }));
          return;
        }

        this.loadingService.setUILoading();
        const { result } = await this.postsService.findOne(a.payload.id);
        const userResult = await this.usersApiService.findOne(result.authorId);
        const userVotesPerPosts = this.authService.isLoggedIn()
          ? await this.votesService.findManyByPostId([result.id])
          : null;

        const data = mapPostViewModel(
          result as GetPostDtoEx,
          userResult.result,
          userVotesPerPosts?.result[0],
          null,
        );
        this.store.dispatch(new GetPostActionSuccess({ data }));
      } catch (error) {
        this.snackbarService.showWarn('Load Post Failed');
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  getPostSuccess$ = this.actions$.pipe(
    ofType<GetPostActionSuccess>(HomeActionTypes.GetPostActionSuccess),
    tap(() => {
      this.loadingService.setUILoading(false);
    }),
  );

  ////////////////////// VOTES ////////////////////////////////////
  @Effect({ dispatch: false })
  createPostVote$ = this.actions$.pipe(
    ofType<CreatePostUpvoteAction>(HomeActionTypes.CreatePostUpvoteAction),
    tap(async a => {
      try {
        this.loadingService.setUILoading();
        const { result } = await this.votesService.create(a.payload.cmd);
        this.store.dispatch(
          new CreatePostUpvoteActionSuccess({ data: result }),
        );
      } catch ({ error }) {
        this.snackbarService.showWarn(error.message);
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  createPostVoteSuccess$ = this.actions$.pipe(
    ofType<CreatePostUpvoteActionSuccess>(
      HomeActionTypes.CreatePostUpvoteActionSuccess,
    ),
    tap(() => {
      this.loadingService.setUILoading(false);
    }),
  );

  // DELETE POSTVOTE
  @Effect({ dispatch: false })
  deletePostVote$ = this.actions$.pipe(
    ofType<DeletePostUpvoteAction>(HomeActionTypes.DeletePostUpvoteAction),
    tap(async a => {
      try {
        this.loadingService.setUILoading();
        const { result } = await this.votesService.delete(a.payload.id);
        this.store.dispatch(
          new DeletePostUpvoteActionSuccess({ data: result }),
        );
      } catch ({ error }) {
        this.snackbarService.showWarn(error.message);
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  deletePostVoteSuccess$ = this.actions$.pipe(
    ofType<DeletePostUpvoteActionSuccess>(
      HomeActionTypes.DeletePostUpvoteActionSuccess,
    ),
    tap(() => {
      this.loadingService.setUILoading(false);
    }),
  );
}
