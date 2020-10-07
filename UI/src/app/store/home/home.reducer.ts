import { VoteType } from './../../home/models/view/home-view-model';
import { GetVoteDto } from './../../home/models/dto/get-vote.dto';
import { HomeActions, HomeActionTypes } from './home.actions';
import { PostViewModel } from '../../home/models/view/post-view-model';
import * as lodash from 'lodash';
import { User } from '../../users/models/dto/user';
import { CommentViewModel } from '../../home/models/view/comment-view-model';

export interface HomeState {
  posts: PostViewModel[];
  votedPosts: PostViewModel[];
  post: PostViewModel;
  isEditSuccessful: boolean;
  isEditCommentSuccessful: boolean;
  comments: CommentViewModel[];
  indexOfEditedComment: number;
  postsTotal: number;
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
        votedPosts: action.payload.data.every(x => x.voteCreated !== undefined) ? action.payload.data : [],
        post: null,
        postsTotal: action.payload.total
      } as HomeState;

    case HomeActionTypes.ClearPostsAction:
      return {
        ...state,
        posts: initialHomeState.posts,
        comments: initialHomeState.comments,
      } as HomeState;

    case HomeActionTypes.ClearPostAction:
      return {
        ...state,
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

    case HomeActionTypes.SetPostPagePost:
      return {
        ...state,
        post: action.payload.data,
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
        isEditCommentSuccessful: false,
      } as HomeState;

    case HomeActionTypes.EditCommentCancelAction:
      commentsClone.splice(state.indexOfEditedComment, 0, action.payload.data);
      return {
        ...state,
        comments: commentsClone,
        indexOfEditedComment: null,
      } as HomeState;

    case HomeActionTypes.EditCommentActionSuccess:
      commentsClone.splice(state.indexOfEditedComment, 0, action.payload.data);
      return {
        ...state,
        comments: commentsClone,
        indexOfEditedComment: null,
        isEditCommentSuccessful: true,
      } as HomeState;

    case HomeActionTypes.CreatePostUpvoteActionSuccess:
      const postToUpvote = postsClone.find(x => x.id === action.payload.data.postId);
      postToUpvote.vote = action.payload.data;

      if (action.payload.data.type === VoteType.Upvote) {
        postToUpvote.upvotes++;
      } else if (action.payload.data.type === VoteType.DownVote) {
        postToUpvote.downvotes++;
      }

      return {
        ...state,
        posts: state.posts.map(p => mapPostVote(p, action.payload.data.postId, postToUpvote)),
      } as HomeState;

    case HomeActionTypes.DeletePostUpvoteActionSuccess:
      const postToUnvote = postsClone.find(x => x.id === action.payload.data.postId);
      postToUnvote.vote = { type: VoteType.Unknown, postId: null, userId: null };

      if (action.payload.data.type === VoteType.Upvote) {
        postToUnvote.upvotes--;
      } else if (action.payload.data.type === VoteType.DownVote) {
        postToUnvote.downvotes--;
      }

      return {
        ...state,
        posts: state.posts.map(p => mapPostVote(p, action.payload.data.postId, postToUnvote)),
      } as HomeState;

    default:
      return state;
  }
}

export function mapPostVote(post: PostViewModel, id: string, newVote: PostViewModel): PostViewModel {
  if (post.id === id) {
    post = newVote;
  }
  return post;
}
