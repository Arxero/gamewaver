import { HomeActions, HomeActionTypes } from './home.actions';
import { PostViewModel } from '../../home/models/view/post-view-model';
import * as lodash from 'lodash';
import { User } from '../../users/models/dto/user';
import { CommentViewModel } from '../../home/models/view/comment-view-model';

export interface HomeState {
  posts: PostViewModel[];
  post: PostViewModel;
  isEditSuccessful: boolean;
  comments: CommentViewModel[];
  indexOfEditedComment: number;
}

export const initialHomeState: HomeState = {
  posts: null,
  comments: [],
} as HomeState;

export function homeReducer(
  state = initialHomeState,
  action: HomeActions,
): HomeState {
  switch (action.type) {
    case HomeActionTypes.CreatePostActionSuccess:
      const temp = lodash.cloneDeep(state.posts);
      temp.unshift(action.payload.data);
      return {
        ...state,
        posts: temp,
      } as HomeState;

    case HomeActionTypes.GetPostsActionSuccess:
      return {
        ...state,
        posts: action.payload.data,
        post: null,
      } as HomeState;

    case HomeActionTypes.DeletePostActionSuccess:
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload.id),
      } as HomeState;

    case HomeActionTypes.GetPostActionSuccess:
      return {
        ...state,
        post: action.payload.data,
      } as HomeState;

    case HomeActionTypes.EditPostAction:
      return {
        ...state,
        isEditSuccessful: false,
      } as HomeState;

    case HomeActionTypes.EditPostActionSuccess:
      return {
        ...state,
        isEditSuccessful: true,
      } as HomeState;

    // COMMENTS ////////////////////////////////////////
    case HomeActionTypes.CreateCommentActionSuccess:
      const tempComments = lodash.cloneDeep(state.comments);
      tempComments.unshift(action.payload.data);
      return {
        ...state,
        comments: tempComments,
      } as HomeState;

    case HomeActionTypes.GetCommentsActionSuccess:
      return {
        ...state,
        comments: action.payload.data,
      } as HomeState;

    case HomeActionTypes.DeleteCommentActionSuccess:
      return {
        ...state,
        comments: state.comments.filter(c => c.id !== action.payload.id),
      } as HomeState;

    case HomeActionTypes.EditCommentInitiateAction:
      return {
        ...state,
        indexOfEditedComment: state.comments.findIndex(
          x => x.id === action.payload.id,
        ),
        comments: state.comments.filter(c => c.id !== action.payload.id),
      } as HomeState;

    case HomeActionTypes.EditCommentCancelAction:
      const tempCommentsCancel = lodash.cloneDeep(state.comments);
      tempCommentsCancel.splice(
        state.indexOfEditedComment,
        0,
        action.payload.data,
      );
      return {
        ...state,
        comments: tempCommentsCancel,
        indexOfEditedComment: null,
      } as HomeState;

    case HomeActionTypes.EditCommentActionSuccess:
      const tempCommentsEditSuccess = lodash.cloneDeep(state.comments);
      tempCommentsEditSuccess.splice(
        state.indexOfEditedComment,
        0,
        action.payload.data,
      );
      return {
        ...state,
        comments: tempCommentsEditSuccess,
      } as HomeState;

    default:
      return state;
  }
}
