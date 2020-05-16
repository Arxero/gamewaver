import { IComment } from "../comment.entity";

export class GetCommentDto implements IComment {
  constructor(data: IComment) {
    this.content = data.content;
  }

  content: string;
}