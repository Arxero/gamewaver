import { VoteType } from './../postVote.entity';
import { PostVoteCmd } from './create-vote.cmd';
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString } from "class-validator";

export class UpdatePostVoteCmd implements PostVoteCmd {
  @ApiProperty()
  @IsEnum(VoteType)
  type: VoteType;
}