import { IComment } from "../comment.entity";

export class GetCommentDto implements IComment {
  constructor(data: IComment) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.content = data.content;
    this.authorId = data.author.id;
    this.postId = data.post.id;
  }

  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  content: string;
  authorId: string;
  postId:string;
}