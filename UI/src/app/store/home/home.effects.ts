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
} from './home.actions';
import { SnackbarService } from '../../services/snackbar.service';
import { UsersService } from '../../services/users.service';
import {
  DataFilter,
  SearchType,
  Sorting,
  SortDirection,
} from '../../shared/models/common';
import { PostViewModel, mapPostViewModel } from '../../home/models/view/post-view-model';
import { AuthState } from '../auth/auth.reducer';
import { userProfile } from '../auth/auth.selectors';

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
        const filters: DataFilter[] = result.items
          .filter(post => result.items.some(x => x.authorId !== post.authorId))
          .map(
            x =>
              ({
                fieldName: 'id',
                searchOperator: SearchType.In,
                searchValue: x.authorId,
              } as DataFilter),
          );

        const resultUsers = await this.usersService.findAll(filters);
        const posts: PostViewModel[] = result.items.map(post => {
          const userInPosts = resultUsers.result.items.find(
            user => post.authorId === user.id,
          );
          return mapPostViewModel(post, userInPosts);
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
}
