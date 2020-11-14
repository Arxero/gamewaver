import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommentsState } from './comments.reducer';

export const selectCommentsState = createFeatureSelector<CommentsState>(
  'comments',
);

export const commentsState = createSelector(
  selectCommentsState,
  commentsState => commentsState,
);

export const commentsStatePostComments = createSelector(
  selectCommentsState,
  commentsState => commentsState.comments,
);

export const commentsStateisEditCommentSuccessful = createSelector(
  selectCommentsState,
  commentsState => commentsState.isEditCommentSuccessful,
);
