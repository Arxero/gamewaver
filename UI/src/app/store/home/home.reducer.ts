import { GetPostDto } from '../../home/models/dto/get-post.dto';
import { HomeActions, HomeActionTypes } from './home.actions';

export interface HomeState {
  posts: GetPostDto[];
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
      return {
        ...state,
      } as HomeState;

    case HomeActionTypes.GetPostsActionSuccess:
      return {
        ...state,
        posts: action.payload.data,
      } as HomeState;

    default:
      return state;
  }
}
