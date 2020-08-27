import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum } from "class-validator";
import { VoteType } from "../postVote.entity";

export class AddPostVoteCmd {
  @ApiProperty()
  @IsString()
  postId: string;

  @ApiProperty()
  @IsEnum(VoteType)
  type: VoteType;
}