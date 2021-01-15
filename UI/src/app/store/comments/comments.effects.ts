import { CommentViewModel } from '../../home/models/comment-view-model';
import {
  Sorting,
  SortDirection,
  DataFilter,
  SearchType,
} from './../../shared/models/common';
import {
  CommentsActionTypes,
  GetCommentsActionSuccess,
  DeleteCommentActionSuccess,
  EditCommentAction,
  EditCommentActionSuccess,
  CreateCommentActionSuccess,
  CreateCommentAction,
  GetCommentsAction,
  DeleteCommentAction,
} from './comments.actions';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { SnackbarService } from './../../services/snackbar.service';
import { UsersService } from './../../services/users.service';
import { CommentsService } from './../../services/comments.service';
import { LoadingService } from './../../services/loading.service';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CommentsState } from './comments.reducer';
import { mapCommmentViewModel } from '../../home/models/comment-view-model';

@Injectable()
export class CommentsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<CommentsState>,
    private snackbarService: SnackbarService,
    private usersService: UsersService,
    private commentsService: CommentsService,
    private loadingService: LoadingService,
  ) {}

  // CREATE COMMENT
  @Effect({ dispatch: false })
  createComment$ = this.actions$.pipe(
    ofType<CreateCommentAction>(CommentsActionTypes.CreateCommentAction),
    tap(async a => {
      try {
        this.loadingService.setUILoading();
        const { result } = await this.commentsService.create(
          a.payload.cmd,
          a.payload.postId,
        );
        const userResult = await this.usersService.findOne(result.authorId);
        const data = mapCommmentViewModel(result, userResult.result);
        this.store.dispatch(new CreateCommentActionSuccess({ data }));
      } catch (error) {
        this.snackbarService.showWarn('Create Comment Failed');
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  createCommentSuccess$ = this.actions$.pipe(
    ofType<CreateCommentActionSuccess>(
      CommentsActionTypes.CreateCommentActionSuccess,
    ),
    tap(() => {
      this.loadingService.setUILoading(false);
      this.snackbarService.showInfo('Comment Added Successfully');
    }),
  );

  // GET COMMENTS
  @Effect({ dispatch: false })
  getComment$ = this.actions$.pipe(
    ofType<GetCommentsAction>(CommentsActionTypes.GetCommentsAction),
    tap(async a => {
      try {
        const dateSort: Sorting = {
          propertyName: 'createdAt',
          sort: SortDirection.DESC,
        };

        this.loadingService.setUILoading();
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
        this.store.dispatch(
          new GetCommentsActionSuccess({
            data: { items: comments, total: result.total },
          }),
        );
      } catch (error) {
        this.snackbarService.showWarn('Get Comments Failed');
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  getCommentSuccess$ = this.actions$.pipe(
    ofType<GetCommentsActionSuccess>(
      CommentsActionTypes.GetCommentsActionSuccess,
    ),
    tap(() => {
      this.loadingService.setUILoading(false);
    }),
  );

  // DELETE COMMENT
  @Effect({ dispatch: false })
  deleteComment$ = this.actions$.pipe(
    ofType<DeleteCommentAction>(CommentsActionTypes.DeleteCommentAction),
    tap(async a => {
      try {
        this.loadingService.setUILoading();
        const { result } = await this.commentsService.delete(a.payload.id);
        this.store.dispatch(
          new DeleteCommentActionSuccess({ id: a.payload.id }),
        );
      } catch ({ error }) {
        this.snackbarService.showWarn(error.message);
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  deleteCommentSuccess$ = this.actions$.pipe(
    ofType<DeleteCommentActionSuccess>(
      CommentsActionTypes.DeleteCommentActionSuccess,
    ),
    tap(() => {
      this.loadingService.setUILoading(false);
      this.snackbarService.showInfo('Comment Deleted Successfully');
    }),
  );

  // EDIT COMMENT
  @Effect({ dispatch: false })
  editComment$ = this.actions$.pipe(
    ofType<EditCommentAction>(CommentsActionTypes.EditCommentAction),
    tap(async a => {
      try {
        this.loadingService.setUILoading();
        const { result } = await this.commentsService.update(
          a.payload.id,
          a.payload.cmd,
        );

        const resultUser = await this.usersService.findOne(result.authorId);
        const data = mapCommmentViewModel(result, resultUser.result);
        this.store.dispatch(new EditCommentActionSuccess({ data }));
      } catch ({ error }) {
        this.snackbarService.showWarn(error.message);
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  editCommentSuccess$ = this.actions$.pipe(
    ofType<EditCommentActionSuccess>(
      CommentsActionTypes.EditCommentActionSuccess,
    ),
    tap(a => {
      this.loadingService.setUILoading(false);
      this.snackbarService.showInfo('Comment Edited Successfully');
    }),
  );
}
