import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
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

@Injectable()
export class HomeEffects {
  constructor(
    private actions$: Actions,
    private store: Store<HomeState>,
    private snackbarService: SnackbarService,
    private postsService: PostsService,
  ) {}

  @Effect({ dispatch: false })
  createPost$ = this.actions$.pipe(
    ofType<CreatePostAction>(HomeActionTypes.CreatePostAction),
    tap(async a => {
      try {
        const result = await this.postsService.create(a.payload.cmd);
        this.store.dispatch(new CreatePostActionSuccess());
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
    tap(async a => {
      try {
        const result = await this.postsService.findAll();
        this.store.dispatch(
          new GetPostsActionSuccess({ data: result.result.items }),
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
}
