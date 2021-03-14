import { UserRole } from './../../users/user';
import { PostCategory } from './post-category';
import { DataEntity } from '../../shared/models/common';
import { VoteType } from './home-view-model';

export interface CreateCommentCmd {
  content: string;
}

export interface CreatePostCmd {
  content: string;
  category: PostCategory;
}

export interface CreatePostVoteCmd {
  postId: string;
  type: VoteType;
}

export interface UpdateCommentCmd {
  content: string;
}

export interface UpdatePostCmd {
  content: string;
  category: PostCategory;
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
  voteCreated: Date;
  commentAuthor: string;
  commentCreated: Date;
}








