import { IComment } from "../comment.entity";

export class CommentUpdateCmd implements IComment {
  constructor(data: IComment) {
    this.content = data.content;
  }
  content: string;
}