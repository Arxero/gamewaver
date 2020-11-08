import { PagedData } from './../../shared/models/common';
import { VoteType } from './../../home/models/view/home-view-model';
import { GetVoteDto } from './../../home/models/dto/get-vote.dto';
import { HomeActions, HomeActionTypes } from './home.actions';
import { PostViewModel } from '../../home/models/view/post-view-model';
import * as lodash from 'lodash';
import { User } from '../../users/models/dto/user';
import { CommentViewModel } from '../../home/models/view/comment-view-model';

export interface HomeState {
  posts: PagedData<PostViewModel>;
  votedPosts: PostViewModel[];
  post: PostViewModel;
  isEditSuccessful: boolean;
  isEditCommentSuccessful: boolean;
  comments: PagedData<CommentViewModel>;
  indexOfEditedComment: number;
}

export const initialHomeState: HomeState = {
  posts: null,
  votedPosts: null,
  post: null,
  isEditSuccessful: null,
  isEditCommentSuccessful: null,
  comments: null,
  indexOfEditedComment: null,
} as HomeState;

export function homeReducer(
  state = initialHomeState,
  action: HomeActions,
): HomeState {
  const commentsClone = lodash.cloneDeep(state.comments);
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

    case HomeActionTypes.ClearCommentsAction:
      return {
        ...state,
        comments: initialHomeState.comments,
      };

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

    // COMMENTS ////////////////////////////////////////
    case HomeActionTypes.CreateCommentActionSuccess:
      commentsClone.items.unshift(action.payload.data);
      return {
        ...state,
        comments: commentsClone,
      } as HomeState;

    case HomeActionTypes.GetCommentsActionSuccess:
      return {
        ...state,
        comments: !state.comments
          ? action.payload.data
          : {
              items: state.comments.items.concat(action.payload.data.items),
              total: action.payload.data.total,
            },
      } as HomeState;

    case HomeActionTypes.DeleteCommentActionSuccess:
      return {
        ...state,
        comments: {
          items: state.comments.items.filter(c => c.id !== action.payload.id),
          total: state.comments.total,
        },
      } as HomeState;

    case HomeActionTypes.EditCommentInitiateAction:
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
      } as HomeState;

    case HomeActionTypes.EditCommentCancelAction:
      commentsClone.items.splice(
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
      commentsClone.items.splice(
        state.indexOfEditedComment,
        0,
        action.payload.data,
      );
      return {
        ...state,
        comments: commentsClone,
        indexOfEditedComment: initialHomeState.indexOfEditedComment,
        isEditCommentSuccessful: true,
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
