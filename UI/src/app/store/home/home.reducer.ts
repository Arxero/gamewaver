import {
  SortUrl,
  SidebarNavigationType,
} from '../../sidebar/models/sidebar-view-model';
import { PagedData } from './../../shared/models/common';
import { VoteType } from './../../home/models/view/home-view-model';
import { GetVoteDto } from './../../home/models/dto/get-vote.dto';
import {
  HomeActions,
  HomeActionTypes,
  SidebarNavigation,
} from './home.actions';
import { PostViewModel } from '../../home/models/view/post-view-model';
import * as lodash from 'lodash';
import { User } from '../../users/models/dto/user';
import { CommentViewModel } from '../../home/models/view/comment-view-model';

export interface HomeState {
  posts: PagedData<PostViewModel>;
  votedPosts: PostViewModel[];
  post: PostViewModel;
  isEditSuccessful: boolean;
  sidebarNavigation: SidebarNavigationType;
}

export const initialHomeState: HomeState = {
  posts: null,
  votedPosts: null,
  post: null,
  isEditSuccessful: null,
  sidebarNavigation: null,
} as HomeState;

export function homeReducer(
  state = initialHomeState,
  action: HomeActions,
): HomeState {
  const postsClone = lodash.cloneDeep(state.posts);

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

    case HomeActionTypes.GetVotedPostsActionSuccess:
      return {
        ...state,
        votedPosts: action.payload.data,
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
        posts: state.posts,
      } as HomeState;

    case HomeActionTypes.DeletePostUpvoteActionSuccess:
      const postToUnvote = postsClone.items.find(
        x => x.id === action.payload.data.postId,
      );
      postToUnvote.vote = {
        type: VoteType.Unknown,
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
        posts: state.posts,
      } as HomeState;

    case HomeActionTypes.SidebarNavigation:
      return {
        ...state,
        sidebarNavigation: action.payload.sidebarNavigation,
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
