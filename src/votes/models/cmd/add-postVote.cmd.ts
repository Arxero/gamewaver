import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum } from "class-validator";
import { VoteType, IVote } from "../postVote.entity";

export class AddPostVoteCmd implements IVote {
  @ApiProperty()
  @IsString()
  postId: string;

  @ApiProperty()
  @IsEnum(VoteType)
  type: VoteType;
}