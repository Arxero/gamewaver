import { DataEntity } from './../../shared/models/common';

export interface HomeViewModel extends DataEntity {
  content: string;
  authorId: string;
  authorAvatar: string;
  authorUsername: string;
  date: string;
  tooltipDate: string;
  userRole: string;
}

export enum PostContext {
  Unknown,
  PostPage,
  PostsPage,
  ProfilePage,
}

export enum UserActionOnPost {
  Unknown = 'unknown',
  Posted = 'posted',
  Commented = 'commented',
  Voted = 'voted'
}

export enum PostPageState {
  Unknown,
  EditPost,
  EditComment,
  Default,
}

export enum VoteType {
  Unknown = 'unknown',
  Upvote = 'upvote',
  DownVote = 'downvote'
}


