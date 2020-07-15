import { HomeActions, HomeActionTypes } from './home.actions';
import { PostViewModel } from '../../home/models/view/post-view-model';
import * as lodash from 'lodash';
import { User } from '../../users/models/dto/user';
import { CommentViewModel } from '../../home/models/view/comment-view-model';

export interface HomeState {
  posts: PostViewModel[];
  post: PostViewModel;
  isEditSuccessful: boolean;
  isEditCommentSuccessful: boolean;
  comments: CommentViewModel[];
  indexOfEditedComment: number;
}

export const initialHomeState: HomeState = {
  posts: [],
  comments: [],
} as HomeState;

export function homeReducer(
  state = initialHomeState,
  action: HomeActions,
): HomeState {
  const commentsClone = lodash.cloneDeep(state.comments);
  const postsClone = lodash.cloneDeep(state.posts);

  switch (action.type) {
    case HomeActionTypes.CreatePostActionSuccess:
      postsClone.unshift(action.payload.data);
      return {
        ...state,
        posts: postsClone,
      } as HomeState;

    case HomeActionTypes.GetPostsActionSuccess:
      return {
        ...state,
        posts: postsClone.concat(action.payload.data),
        post: null,
      } as HomeState;

      case HomeActionTypes.ClearPostsAction:
        return {
          ...state,
          posts: initialHomeState.posts,
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
      commentsClone.unshift(action.payload.data);
      return {
        ...state,
        comments: commentsClone,
      } as HomeState;

    case HomeActionTypes.GetCommentsActionSuccess:
      return {
        ...state,
        comments: commentsClone.concat(action.payload.data),
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
        isEditCommentSuccessful: false
      } as HomeState;

    case HomeActionTypes.EditCommentCancelAction:
      commentsClone.splice(
        state.indexOfEditedComment,
        0,
        action.payload.data,
      );
      return {
        ...state,
        comments: commentsClone,
        indexOfEditedComment: null,
      } as HomeState;

    case HomeActionTypes.EditCommentActionSuccess:
      commentsClone.splice(
        state.indexOfEditedComment,
        0,
        action.payload.data,
      );
      return {
        ...state,
        comments: commentsClone,
        indexOfEditedComment: null,
        isEditCommentSuccessful: true
      } as HomeState;

    default:
      return state;
  }
}
