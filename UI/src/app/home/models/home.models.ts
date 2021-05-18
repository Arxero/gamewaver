import { VoteType } from './home-view-model';
import { DataEntity, UserRole, PostCategory } from '@gamewaver/shared';

export interface PostCmd {
  content: string;
  category: PostCategory;
}

export interface CommentCmd {
  content: string;
}

export interface PostVoteCmd {
  postId: string;
  type: VoteType;
}

export interface GetCommentDto extends DataEntity {
  content: string;
  authorId: string;
  postId: string;
}

export interface GetCommentsCountDto {
  postId: string;
  count: number;
}

export interface GetVoteDto {
  id?: string;
  type: VoteType;
  postId: string;
  userId: string;
}

export interface GetVotesCountDto {
  upvotes: number;
  downvotes: number;
  postId: string;
}

export interface GetPostDto extends DataEntity {
  content: string;
  category: PostCategory;
  authorId: string;
}

export interface GetPostDtoEx extends GetPostDto {
  upvotes: number;
  downvotes: number;
  comments: number;
  role: UserRole;
  avatar: string;
  username: string;
  voteCreated?: Date; // when user voted on this post
  commentCreated?: Date; // when user commented on this post
}
