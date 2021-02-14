import { IComment } from "../comment.entity";
import { IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ICommentCmd } from "./comment-create.cmd";

export class CommentUpdateCmd implements ICommentCmd {
  @ApiProperty({ minLength: 3, maxLength: 1000 })
  @IsString()
  @Length(3, 1000)
  content: string;
}