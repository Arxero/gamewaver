import { VoteType } from './../view/home-view-model';

export interface CreatePostVoteCmd {
  postId: string;
  type: VoteType;
}
