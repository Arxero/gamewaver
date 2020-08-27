import { IVote, VoteType } from '../postVote.entity';

export class GetVoteDto implements IVote {
  constructor(data: IVote) {
    if (data) {
      this.type = data.type;
      this.id = data.id;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
      this.postId = data.postId;
    }
  }

  type: VoteType;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  postId: string;
}
