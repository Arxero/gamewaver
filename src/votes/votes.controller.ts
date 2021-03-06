import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IResponseBase } from './../common/models/response';
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
  Put,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostVoteCmd } from './models/cmd/create-vote.cmd';
import { IResponse, ResponseSuccess } from 'src/common/models/response';
import { GetVoteDto } from './models/dto/get-vote.dto';
import { ApiTags, ApiQuery, ApiProperty, ApiOperation } from '@nestjs/swagger';
import { GetVotesCountDto } from './models/dto/get-votes-count.dto';
import { PostIdsQuery } from './models/cmd/post-ids.query';
import { UpdatePostVoteCmd } from './models/cmd/update-vote.cmd';

@ApiTags('Votes')
@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Adds vote depending on the VoteType' })
  @Post()
  @Roles('admin', 'user')
  async create(@Body() createModel: CreatePostVoteCmd): Promise<IResponse<GetVoteDto>> {
    const result = await this.votesService.create(createModel);
    return new ResponseSuccess<GetVoteDto>({ result: new GetVoteDto(result) });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Change already voted post' })
  @Put(':id')
  @Roles('admin', 'user')
  async update(
    @Param('id') id: string,
    @Body() updateModel: UpdatePostVoteCmd,
  ): Promise<IResponse<GetVoteDto>> {
    const result = await this.votesService.update(id, updateModel);
    return new ResponseSuccess<GetVoteDto>({
      result: new GetVoteDto(result),
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'userId',
    required: true,
  })
  @ApiOperation({ summary: 'Finds single vote' })
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
  @ApiOperation({ summary: 'Gets user votes on the required post ids' })
  @Get()
  async findManyByPostId(
    @Query(new ValidationPipe({ transform: true })) postIdsquery: PostIdsQuery,
  ): Promise<IResponse<GetVoteDto[]>> {
    const result = (await this.votesService.findMany(postIdsquery.postIds)).map(x => new GetVoteDto(x));
    return new ResponseSuccess<GetVoteDto[]>({ result });
  }

  @UseGuards()
  @ApiQuery({ name: 'postIds', required: true, description: `id1,id2` })
  @ApiOperation({ summary: 'Gets votes count by post ids' })
  @Get('count')
  async findCountByPostId(
    @Query(new ValidationPipe({ transform: true })) postIdsquery: PostIdsQuery,
  ): Promise<IResponse<GetVotesCountDto[]>> {
    const result = await this.votesService.findCountByPostIds(postIdsquery.postIds);
    return new ResponseSuccess<GetVotesCountDto[]>({ result });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Used when user unvotes' })
  @Delete(':id')
  @Roles('admin', 'user')
  async delete(@Param('id') id: string): Promise<IResponse<GetVoteDto>> {
    const result = await this.votesService.delete({ id });
    return new ResponseSuccess<GetVoteDto>({ result: new GetVoteDto(result) });
  }
}
