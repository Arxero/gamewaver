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
import { ApiTags, ApiQuery } from '@nestjs/swagger';
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
  @ApiQuery({ name: 'postIds', required: true, description: `id1,id2` })
  @Get(':postIds')
  async findCountByPostId(
    @Param('postIds') postIds: string,
  ): Promise<IResponse<GetVoteDto[]>> {
    const ids = postIds.split(',');
    const result = await (await this.votesService.findMany(ids)).map(x => new GetVoteDto(x));
    return new ResponseSuccess<GetVoteDto[]>({ result });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<IResponse<GetVoteDto>> {
    const result = await this.votesService.delete({ id });
    return new ResponseSuccess<GetVoteDto>({ result: new GetVoteDto(result) });
  }
}
