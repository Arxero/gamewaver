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


export interface GetPostDto extends DataEntity {
  content: string;
  title: string;
  category: PostCategory;
  authorId: string;

  upvotes: number;
  downvotes: number;
  voteCreated: Date;
}

export interface GetVoteDto {
  type: VoteType;
  id?: string;
  createdAt?: Date;
  postId: string;
  userId: string;
}






