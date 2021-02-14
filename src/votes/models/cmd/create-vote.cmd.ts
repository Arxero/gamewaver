import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum } from "class-validator";
import { VoteType, IVote } from "../postVote.entity";

export interface PostVoteCmd {
  type: VoteType;
  postId?: string;
}

export class CreatePostVoteCmd implements PostVoteCmd {
  @ApiProperty()
  @IsString()
  postId: string;

  @ApiProperty()
  @IsEnum(VoteType)
  type: VoteType;
}