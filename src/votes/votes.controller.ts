import { PostVote } from './models/postVote.entity';
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Delete,
  Param,
  Get,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddPostVoteCmd } from './models/cmd/add-postVote.cmd';
import { IResponse, ResponseSuccess } from 'src/common/models/response';
import { GetVoteDto } from './models/dto/get-vote.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { GetVotesCountDto } from './models/dto/get-votes-count.dto';
import { PostIdsQuery } from './models/cmd/post-ids.query';

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
  @ApiQuery({ name: 'postIds', required: true, description: `id1,id2` })
  @Get()
  async findManyByPostId(
    @Query(new ValidationPipe({ transform: true })) postIdsquery: PostIdsQuery,
  ): Promise<IResponse<GetVoteDto[]>> {
    const result = await (await this.votesService.findMany(postIdsquery.postIds)).map(x => new GetVoteDto(x));
    return new ResponseSuccess<GetVoteDto[]>({ result });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<IResponse<GetVoteDto>> {
    const result = await this.votesService.delete({ id });
    return new ResponseSuccess<GetVoteDto>({ result: new GetVoteDto(result) });
  }
}
