import { PagedData } from '../../shared/models/common';
import { CommentViewModel } from '../../home/models/comment-view-model';
import { CommentsActions, CommentsActionTypes } from './comments.actions';
import * as lodash from 'lodash';

export interface CommentsState {
  isEditCommentSuccessful: boolean;
  comments: PagedData<CommentViewModel>;
  indexOfEditedComment: number;
}

export const initialCommentsState: CommentsState = {
  isEditCommentSuccessful: null,
  comments: null,
  indexOfEditedComment: null,
} as CommentsState;

export function commentsReducer(
  state = initialCommentsState,
  action: CommentsActions,
): CommentsState {
  const commentsClone = lodash.cloneDeep(state.comments);

  switch (action.type) {
    case CommentsActionTypes.CreateCommentActionSuccess:
      commentsClone.items.unshift(action.payload.data);
      return {
        ...state,
        comments: commentsClone,
      } as CommentsState;

    case CommentsActionTypes.GetCommentsActionSuccess:
      return {
        ...state,
        comments: !state.comments
          ? action.payload.data
          : {
              items: state.comments.items.concat(action.payload.data.items),
              total: action.payload.data.total,
            },
      } as CommentsState;

    case CommentsActionTypes.DeleteCommentActionSuccess:
      return {
        ...state,
        comments: {
          items: state.comments.items.filter(c => c.id !== action.payload.id),
          total: state.comments.total,
        },
      } as CommentsState;

    case CommentsActionTypes.EditCommentInitiateAction:
      return {
        ...state,
        indexOfEditedComment: state.comments.items.findIndex(
          x => x.id === action.payload.id,
        ),
        comments: {
          items: state.comments.items.filter(c => c.id !== action.payload.id),
          total: state.comments.total,
        },
        isEditCommentSuccessful: false,
      } as CommentsState;

    case CommentsActionTypes.EditCommentCancelAction:
      commentsClone.items.splice(
        state.indexOfEditedComment,
        0,
        action.payload.data,
      );
      return {
        ...state,
        comments: commentsClone,
        indexOfEditedComment: null,
      } as CommentsState;

    case CommentsActionTypes.EditCommentActionSuccess:
      commentsClone.items.splice(
        state.indexOfEditedComment,
        0,
        action.payload.data,
      );
      return {
        ...state,
        comments: commentsClone,
        indexOfEditedComment: initialCommentsState.indexOfEditedComment,
        isEditCommentSuccessful: true,
      } as CommentsState;

    case CommentsActionTypes.ClearCommentsAction:
      return {
        ...state,
        comments: initialCommentsState.comments,
      };

    default:
      return state;
  }
}
