import { IComment } from "../comment.entity";

export class GetCommentDto implements IComment {
  constructor(data: IComment) {
    this.content = data.content;
    this.authorId = data.author.id;
    this.postId = data.post.id;
  }

  content: string;
  authorId: string;
  postId:string;
}