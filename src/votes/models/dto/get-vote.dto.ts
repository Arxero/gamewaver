import { IVote, VoteType } from '../postVote.entity';

export class GetVoteDto implements IVote {
  constructor(data: IVote) {
    if (data) {
      this.type = data.type;
      this.id = data.id;
      this.createdAt = data.createdAt;
      this.postId = data.post.id;
      this.userId = data.user.id;
    }
  }

  type: VoteType;
  id?: string;
  createdAt?: Date;
  postId: string;
  userId: string;
}
