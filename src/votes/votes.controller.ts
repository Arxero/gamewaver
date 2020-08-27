import { PostVote } from './models/postVote.entity';
import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { VotesService } from './votes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddPostVoteCmd } from './models/cmd/add-postVote.cmd';
import { IResponse, ResponseSuccess } from 'src/common/models/response';
import { GetVoteDto } from './models/dto/get-vote.dto';
import { GetPostDto } from 'src/posts/models/dto/get-post.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Votes')
@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createModel: AddPostVoteCmd,
  ): Promise<IResponse<GetVoteDto>> {
    const result = await this.votesService.create(new PostVote(createModel));
    return new ResponseSuccess<GetVoteDto>({ result: new GetVoteDto(result) });
  }
}
