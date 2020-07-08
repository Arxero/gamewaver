import { HomeActions, HomeActionTypes } from './home.actions';
import { PostViewModel } from '../../home/models/view/post-view-model';
import * as lodash from 'lodash';
import { User } from '../../users/models/dto/user';
import { CommentViewModel } from '../../home/models/view/comment-view-model';

export interface HomeState {
  posts: PostViewModel[];
  usersInPosts: User[];
  post: PostViewModel;
  userInPost: User;
  isEditSuccessful: boolean;
  comments: CommentViewModel[];
}

export const initialHomeState: HomeState = {
  posts: null,
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
        usersInPosts: action.payload.users,
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
        userInPost: action.payload.user,
      } as HomeState;

      case HomeActionTypes.EditPostAction:
        return {
          ...state,
          isEditSuccessful: false
        } as HomeState;

      case HomeActionTypes.EditPostActionSuccess:
        return {
          ...state,
          isEditSuccessful: true
        } as HomeState;

    default:
      return state;
  }
}
