import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum } from "class-validator";
import { VoteType, IVote } from "../postVote.entity";

export class CreatePostVoteCmd {
  @ApiProperty()
  @IsString()
  postId: string;

  @ApiProperty()
  @IsEnum(VoteType)
  type: VoteType;
}