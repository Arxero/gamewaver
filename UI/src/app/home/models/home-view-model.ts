import { PostCategory } from './post-category';
import { GetVoteDto } from './home.models';

export interface HomeViewModel {
  id: string;
  content: string;
  authorId: string;
  avatar: string;
  username: string;
  date: string;
  tooltipDate: string;
  userRole: string;
}


export interface PostViewModel extends HomeViewModel {
  category: PostCategory;
  categoryLabel: string;
  userActionOnPost?: UserActionOnPost;
  comments: number;

  upvotes: number;
  downvotes: number;
  vote?: GetVoteDto;
}

export interface CommentViewModel extends HomeViewModel {
  postId: string;
}

export enum PostContext {
  PostPage,
  PostsPage,
  ProfilePage,
}

export enum UserActionOnPost {
  Posted = 'posted',
  Commented = 'commented',
  Voted = 'voted'
}

export enum PostPageState {
  EditPost,
  EditComment,
  Default,
}

export enum VoteType {
  Upvote = 'upvote',
  DownVote = 'downvote'
}


