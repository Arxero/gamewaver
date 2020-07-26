import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, map, withLatestFrom } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { HomeState } from './home.reducer';
import { PostsService } from '../../services/posts.service';
import {
  HomeActionTypes,
  CreatePostAction,
  CreatePostActionSuccess,
  CreatePostActionFailure,
  GetPostsAction,
  GetPostsActionFailure,
  GetPostsActionSuccess,
  DeletePostAction,
  DeletePostActionSuccess,
  DeletePostActionFailure,
  GetPostAction,
  GetPostActionSuccess,
  GetPostActionFailure,
  EditPostAction,
  EditPostActionSuccess,
  EditPostActionFailure,
  CreateCommentAction,
  CreateCommentActionSuccess,
  CreateCommentActionFailure,
  GetCommentsActionFailure,
  GetCommentsAction,
  GetCommentsActionSuccess,
  DeleteCommentAction,
  DeleteCommentActionSuccess,
  DeleteCommentActionFailure,
  EditCommentActionFailure,
  EditCommentAction,
  EditCommentActionSuccess,
} from './home.actions';
import { SnackbarService } from '../../services/snackbar.service';
import { UsersService } from '../../services/users.service';
import {
  DataFilter,
  SearchType,
  Sorting,
  SortDirection,
} from '../../shared/models/common';
import {
  PostViewModel,
  mapPostViewModel,
} from '../../home/models/view/post-view-model';
import { AuthState } from '../auth/auth.reducer';
import { userProfile } from '../auth/auth.selectors';
import { uniq, templateSettings, uniqBy } from 'lodash';
import { Router } from '@angular/router';
import { CommentsService } from '../../services/comments.service';
import {
  mapCommmentViewModel,
  CommentViewModel,
} from '../../home/models/view/comment-view-model';
import { UserActionOnPost } from '../../home/models/view/home-view-model';

@Injectable()
export class HomeEffects {
  constructor(
    private actions$: Actions,
    private store: Store<HomeState>,
    private storeAuth: Store<AuthState>,
    private snackbarService: SnackbarService,
    private postsService: PostsService,
    private usersService: UsersService,
    private commentsService: CommentsService,
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
        const { result } = await this.postsService.create(a[0].payload.cmd);
        const data = mapPostViewModel(result, user);
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
      this.snackbarService.showInfo('Post Added Successfully');
    }),
  );

  @Effect({ dispatch: false })
  createPostFailure$ = this.actions$.pipe(
    ofType<CreatePostActionFailure>(HomeActionTypes.CreatePostActionFailure),
    map(() => {}),
  );

  // EDIT POST
  @Effect({ dispatch: false })
  editPost$ = this.actions$.pipe(
    ofType<EditPostAction>(HomeActionTypes.EditPostAction),
    tap(async a => {
      try {
        const { result } = await this.postsService.update(
          a.payload.id,
          a.payload.cmd,
        );
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
      this.snackbarService.showInfo('Post Edited Successfully');
      this.store.dispatch(new GetPostAction({ id: a.payload.id }));
    }),
  );

  @Effect({ dispatch: false })
  editPostFailure$ = this.actions$.pipe(
    ofType<EditPostActionFailure>(HomeActionTypes.EditPostActionFailure),
    map(() => {}),
  );

  // GET POSTS
  @Effect({ dispatch: false })
  getPosts$ = this.actions$.pipe(
    ofType<GetPostsAction>(HomeActionTypes.GetPostsAction),
    tap(async a => {
      try {
        const dateSort: Sorting = {
          propertyName: 'createdAt',
          sort: SortDirection.DESC,
        };
        const { result } = await this.postsService.findAll(
          a.payload.paging,
          a.payload.filters,
          [dateSort],
        );
        const searchValueStr = result.items
          .map(x => x.authorId)
          .filter((v, i, s) => s.indexOf(v) === i)
          .join(',');
        const filter: DataFilter = {
          fieldName: 'id',
          searchOperator: SearchType.In,
          searchValue: searchValueStr,
        };

        const resultUsers = await this.usersService.findAll([filter]);
        const posts: PostViewModel[] = result.items.map(post => {
          const userInPosts = resultUsers.result.items.find(
            user => post.authorId === user.id,
          );
          return mapPostViewModel(post, userInPosts, a.payload.userActionOnPost);
        });
        this.store.dispatch(new GetPostsActionSuccess({ data: posts }));
      } catch (error) {
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  getPostsSuccess$ = this.actions$.pipe(
    ofType<GetPostsActionSuccess>(HomeActionTypes.GetPostsActionSuccess),
    tap(() => {}),
  );

  @Effect({ dispatch: false })
  getPostsFailure$ = this.actions$.pipe(
    ofType<GetPostsActionFailure>(HomeActionTypes.GetPostsActionFailure),
    map(() => {}),
  );

  // DELETE POST
  @Effect({ dispatch: false })
  deletePost$ = this.actions$.pipe(
    ofType<DeletePostAction>(HomeActionTypes.DeletePostAction),
    tap(async a => {
      try {
        const { result } = await this.postsService.delete(a.payload.id);
        this.store.dispatch(new DeletePostActionSuccess({ id: a.payload.id }));
      } catch (error) {
        this.store.dispatch(new DeletePostActionFailure());
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  deletePostSuccess$ = this.actions$.pipe(
    ofType<DeletePostActionSuccess>(HomeActionTypes.DeletePostActionSuccess),
    tap(() => {
      this.snackbarService.showInfo('Post Deleted Successfully');
    }),
  );

  @Effect({ dispatch: false })
  deletePostFailure$ = this.actions$.pipe(
    ofType<DeletePostActionFailure>(HomeActionTypes.DeletePostActionFailure),
    map(() => {
      this.snackbarService.showWarn('Post Deletion Failed');
    }),
  );

  // GET POST
  @Effect({ dispatch: false })
  getPost$ = this.actions$.pipe(
    ofType<GetPostAction>(HomeActionTypes.GetPostAction),
    tap(async a => {
      try {
        const { result } = await this.postsService.findOne(a.payload.id);
        const userResult = await this.usersService.findOne(result.authorId);
        const data = mapPostViewModel(result, userResult.result);
        this.store.dispatch(new GetPostActionSuccess({ data }));
      } catch (error) {
        this.store.dispatch(new GetPostActionFailure());
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  getPostSuccess$ = this.actions$.pipe(
    ofType<GetPostActionSuccess>(HomeActionTypes.GetPostActionSuccess),
    tap(() => {}),
  );

  @Effect({ dispatch: false })
  getPostFailure$ = this.actions$.pipe(
    ofType<GetPostActionFailure>(HomeActionTypes.GetPostActionFailure),
    map(() => {
      this.snackbarService.showWarn('Load Post Failed');
    }),
  );

  // COMMENTS /////////////////////////////////////////////////

  // CREATE COMMENT
  @Effect({ dispatch: false })
  createComment$ = this.actions$.pipe(
    ofType<CreateCommentAction>(HomeActionTypes.CreateCommentAction),
    tap(async a => {
      try {
        const { result } = await this.commentsService.create(
          a.payload.cmd,
          a.payload.postId,
        );
        const userResult = await this.usersService.findOne(result.authorId);
        const data = mapCommmentViewModel(result, userResult.result);
        this.store.dispatch(new CreateCommentActionSuccess({ data }));
      } catch (error) {
        this.store.dispatch(new CreateCommentActionFailure());
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  createCommentSuccess$ = this.actions$.pipe(
    ofType<CreateCommentActionSuccess>(
      HomeActionTypes.CreateCommentActionSuccess,
    ),
    tap(() => {
      this.snackbarService.showInfo('Comment Added Successfully');
    }),
  );

  @Effect({ dispatch: false })
  createCommentFailure$ = this.actions$.pipe(
    ofType<CreateCommentActionFailure>(
      HomeActionTypes.CreateCommentActionFailure,
    ),
    map(() => {
      this.snackbarService.showWarn('Create Comment Failed');
    }),
  );

  // GET COMMENTS
  @Effect({ dispatch: false })
  getComment$ = this.actions$.pipe(
    ofType<GetCommentsAction>(HomeActionTypes.GetCommentsAction),
    tap(async a => {
      try {
        const dateSort: Sorting = {
          propertyName: 'createdAt',
          sort: SortDirection.DESC,
        };

        const { result } = await this.commentsService.findAll(
          a.payload.paging,
          a.payload.filters,
          [dateSort],
        );

        const searchValueStr = result.items
          .map(x => x.authorId)
          .filter((v, i, s) => s.indexOf(v) === i)
          .join(',');
        const filter: DataFilter = {
          fieldName: 'id',
          searchOperator: SearchType.In,
          searchValue: searchValueStr,
        };

        const resultUsers = await this.usersService.findAll([filter]);
        const comments: CommentViewModel[] = result.items.map(comment => {
          const userInComments = resultUsers.result.items.find(
            user => comment.authorId === user.id,
          );
          return mapCommmentViewModel(comment, userInComments);
        });
        this.store.dispatch(new GetCommentsActionSuccess({ data: comments }));
      } catch (error) {
        this.store.dispatch(new GetCommentsActionFailure());
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  getCommentSuccess$ = this.actions$.pipe(
    ofType<GetCommentsActionSuccess>(HomeActionTypes.GetCommentsActionSuccess),
    tap(() => {}),
  );

  @Effect({ dispatch: false })
  getCommentFailure$ = this.actions$.pipe(
    ofType<GetCommentsActionFailure>(HomeActionTypes.GetCommentsActionFailure),
    map(() => {
      this.snackbarService.showWarn('Get Comments Failed');
    }),
  );

  // DELETE COMMENT
  @Effect({ dispatch: false })
  deleteComment$ = this.actions$.pipe(
    ofType<DeleteCommentAction>(HomeActionTypes.DeleteCommentAction),
    tap(async a => {
      try {
        const { result } = await this.commentsService.delete(a.payload.id);
        this.store.dispatch(
          new DeleteCommentActionSuccess({ id: a.payload.id }),
        );
      } catch ({ error }) {
        this.store.dispatch(new DeleteCommentActionFailure({ error }));
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  deleteCommentSuccess$ = this.actions$.pipe(
    ofType<DeleteCommentActionSuccess>(
      HomeActionTypes.DeleteCommentActionSuccess,
    ),
    tap(() => {
      this.snackbarService.showInfo('Comment Deleted Successfully');
    }),
  );

  @Effect({ dispatch: false })
  deleteCommentFailure$ = this.actions$.pipe(
    ofType<DeleteCommentActionFailure>(
      HomeActionTypes.DeleteCommentActionFailure,
    ),
    map(a => {
      this.snackbarService.showWarn(a.payload.error.message);
    }),
  );

  // EDIT COMMENT
  @Effect({ dispatch: false })
  editComment$ = this.actions$.pipe(
    ofType<EditCommentAction>(HomeActionTypes.EditCommentAction),
    tap(async a => {
      try {
        const { result } = await this.commentsService.update(
          a.payload.id,
          a.payload.cmd,
        );

        const resultUser = await this.usersService.findOne(result.authorId);
        const data = mapCommmentViewModel(result, resultUser.result);
        this.store.dispatch(new EditCommentActionSuccess({ data }));
      } catch ({ error }) {
        this.store.dispatch(new EditCommentActionFailure({ error }));
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  editCommentSuccess$ = this.actions$.pipe(
    ofType<EditCommentActionSuccess>(HomeActionTypes.EditCommentActionSuccess),
    tap(a => {
      this.snackbarService.showInfo('Comment Edited Successfully');
    }),
  );

  @Effect({ dispatch: false })
  editCommentFailure$ = this.actions$.pipe(
    ofType<EditCommentActionFailure>(HomeActionTypes.EditCommentActionFailure),
    map(a => {
      this.snackbarService.showWarn(a.payload.error.message);
    }),
  );
}
