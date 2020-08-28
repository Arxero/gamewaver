import { PostVote } from './models/postVote.entity';
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Delete,
  Param,
  Get,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddPostVoteCmd } from './models/cmd/add-postVote.cmd';
import { IResponse, ResponseSuccess } from 'src/common/models/response';
import { GetVoteDto } from './models/dto/get-vote.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetVotesCountDto } from './models/dto/get-votes-count.dto';

@ApiTags('Votes')
@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createModel: AddPostVoteCmd,
  ): Promise<IResponse<GetVoteDto>> {
    const result = await this.votesService.create(
      new PostVote(createModel),
      createModel.postId,
    );
    return new ResponseSuccess<GetVoteDto>({ result: new GetVoteDto(result) });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId/:postId')
  async findOne(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ): Promise<IResponse<GetVoteDto>> {
    const result = new GetVoteDto(
      await this.votesService.findOne({
        user: { id: userId },
        post: { id: postId },
      }),
    );
    return new ResponseSuccess<GetVoteDto>({ result });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':postId')
  async findCountByPostId(
    @Param('postId') postId: string,
  ): Promise<IResponse<GetVotesCountDto>> {
    const result = await this.votesService.findCountByPostId(postId);
    return new ResponseSuccess<GetVotesCountDto>({ result });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<IResponse<GetVoteDto>> {
    const result = await this.votesService.delete({ id });
    return new ResponseSuccess<GetVoteDto>({ result: new GetVoteDto(result) });
  }
}
