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

@Injectable()
export class HomeEffects {
  constructor(
    private actions$: Actions,
    private store: Store<HomeState>,
    private storeAuth: Store<AuthState>,
    private snackbarService: SnackbarService,
    private postsService: PostsService,
    private usersService: UsersService,
  ) {}

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

  // GET POSTS
  @Effect({ dispatch: false })
  getPosts$ = this.actions$.pipe(
    ofType<GetPostsAction>(HomeActionTypes.GetPostsAction),
    tap(async () => {
      try {
        const dateSort: Sorting = {
          propertyName: 'createdAt',
          sort: SortDirection.DESC,
        };
        const { result } = await this.postsService.findAll(null, [dateSort]);
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
          return mapPostViewModel(post, userInPosts);
        });
        this.store.dispatch(
          new GetPostsActionSuccess({
            data: posts,
            users: resultUsers.result.items,
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
        this.store.dispatch(
          new GetPostActionSuccess({ data, user: userResult.result }),
        );
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
}
