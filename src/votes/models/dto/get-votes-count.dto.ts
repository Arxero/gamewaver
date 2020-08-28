import { runInThisContext } from 'vm';

export class GetVotesCountDto {
  constructor(data: { upvotes: number; downvotes: number; postId: string }) {
    if (data) {
      this.upvotes = data.upvotes;
      this.downvotes = data.downvotes;
      this.postId = data.postId;
    }
  }

  upvotes: number;
  downvotes: number;
  postId: string;
}
