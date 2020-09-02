import { VoteType } from './../view/home-view-model';

export interface GetVoteDto {
  type: VoteType;
  id?: string;
  createdAt?: Date;
  postId: string;
  userId: string;
}
