export class GetCommentsCountDto {
  constructor(data: { postid: string; count: number }) {
    this.postId = data.postid;
    this.count = data.count;
  }

  postId: string;
  count: number;
}
