import { BaseDto } from './../../../common/models/base.dto';
import { IComment } from "../comment.entity";


export class GetCommentDto extends BaseDto {
  constructor(data: IComment) {
    super(data);
    this.content = data.content;
    this.authorId = data.author.id;
    this.postId = data.post.id;
  }

  content: string;
  authorId: string;
  postId:string;
}