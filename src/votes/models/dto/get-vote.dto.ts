import { BaseDto } from './../../../common/models/base.dto';
import { IVote, VoteType } from '../postVote.entity';

export class GetVoteDto extends BaseDto {
  constructor(data: IVote) {
    super(data)
    this.type = data.type;
    this.postId = data.post.id;
    this.userId = data.user.id;
  }

  type: VoteType;
  postId: string;
  userId: string;
}
