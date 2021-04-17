import { SidebarNavigationType } from '../../sidebar/sidebar-view.models';
import { PagedData } from './../../shared/models/common';
import { VoteType, PostViewModel } from './../../home/models/home-view-model';
import { HomeActions, HomeActionTypes } from './home.actions';
import { cloneDeep } from 'lodash';

export interface HomeState {
  posts: PagedData<PostViewModel>;
  post: PostViewModel;
  isEditSuccessful: boolean;
  sidebarNavigation: SidebarNavigationType;
  scrollPosition: [number, number];
}

export const initialHomeState: HomeState = {
  posts: null,
  votedPosts: null,
  post: null,
  isEditSuccessful: null,
  sidebarNavigation: null,
  scrollPosition: null,
  commentedPosts: null,
} as HomeState;

export function homeReducer(
  state = initialHomeState,
  action: HomeActions,
): HomeState {
  const postsClone = cloneDeep(state.posts);

  switch (action.type) {
    case HomeActionTypes.CreatePostActionSuccess:
      postsClone.items.unshift(action.payload.data);
      return {
        ...state,
        posts: postsClone,
      } as HomeState;

    case HomeActionTypes.GetPostsActionSuccess:
      return {
        ...state,
        posts: !state.posts
          ? action.payload.data
          : {
              items: state.posts.items.concat(action.payload.data.items),
              total: action.payload.data.total,
            },
      } as HomeState;

    case HomeActionTypes.ClearPostsAction:
      return {
        ...state,
        posts: initialHomeState.posts,
      } as HomeState;

    case HomeActionTypes.ClearPostAction:
      return {
        ...state,
        post: initialHomeState.post,
      } as HomeState;

    case HomeActionTypes.DeletePostActionSuccess:
      return {
        ...state,
        posts: {
          items: state.posts.items.filter(
            post => post.id !== action.payload.id,
          ),
          total: state.posts.total,
        },
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

    case HomeActionTypes.SetPostPagePost:
      return {
        ...state,
        post: action.payload.data,
      } as HomeState;

    case HomeActionTypes.CreatePostUpvoteActionSuccess:
      const postToUpvote = postsClone.items.find(
        x => x.id === action.payload.data.postId,
      );
      postToUpvote.vote = action.payload.data;

      if (action.payload.data.type === VoteType.Upvote) {
        postToUpvote.upvotes++;
      } else if (action.payload.data.type === VoteType.DownVote) {
        postToUpvote.downvotes++;
      }

      state.posts.items.map(p =>
        mapPostVote(p, action.payload.data.postId, postToUpvote),
      );
      return {
        ...state,
        posts: postsClone,
        post: postToUpvote,
      } as HomeState;

    case HomeActionTypes.DeletePostUpvoteActionSuccess:
      const postToUnvote = postsClone.items.find(
        x => x.id === action.payload.data.postId,
      );
      postToUnvote.vote = {
        type: null,
        postId: null,
        userId: null,
      };

      if (action.payload.data.type === VoteType.Upvote) {
        postToUnvote.upvotes--;
      } else if (action.payload.data.type === VoteType.DownVote) {
        postToUnvote.downvotes--;
      }

      state.posts.items.map(p =>
        mapPostVote(p, action.payload.data.postId, postToUnvote),
      );
      return {
        ...state,
        posts: postsClone,
        post: postToUnvote,
      } as HomeState;

    case HomeActionTypes.SidebarNavigation:
      return {
        ...state,
        sidebarNavigation: action.payload.sidebarNavigation,
      };

    case HomeActionTypes.SaveScrollPositionAction:
      return {
        ...state,
        scrollPosition: action.payload.data,
      };

    default:
      return state;
  }
}

export function mapPostVote(
  post: PostViewModel,
  id: string,
  newVote: PostViewModel,
): PostViewModel {
  if (post.id === id) {
    post = newVote;
  }
  return post;
}
