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
import { UsersService } from '../../services/users.service';
import { DataFilter, SearchType } from '../../shared/models/common';
import { PostViewModel } from '../../home/models/view/post-view-model';
import { postCategories } from '../../home/models/view/post-category';

@Injectable()
export class HomeEffects {
  constructor(
    private actions$: Actions,
    private store: Store<HomeState>,
    private snackbarService: SnackbarService,
    private postsService: PostsService,
    private usersService: UsersService,
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
    tap(async () => {
      try {
        const { result } = await this.postsService.findAll();
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
          return {
            ...post,
            authorAvatar: userInPosts.avatar,
            authorUsername: userInPosts.username,
            category: postCategories.find(j => j.value === post.category).label,
            date: post.createdAt.toString()
          } as PostViewModel;
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
