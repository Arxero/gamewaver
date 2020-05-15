import { IComment } from "../comment.entity";

export class CommentCreateCmd implements IComment {
  constructor(data: IComment) {
    this.content = data.content;
  }
  content: string;
}