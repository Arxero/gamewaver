import { PostVote } from './models/postVote.entity';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseError } from 'src/common/models/response';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TokenUserPayloadDto } from 'src/auth/models/dto/token-user-payload.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(PostVote)
    private postVoteRepository: Repository<PostVote>,
    @Inject(REQUEST) private request: Request,
    private usersService: UsersService,
  ) {}

  async create(payload: PostVote): Promise<PostVote> {
    try {
      const user = new TokenUserPayloadDto(this.request.user);
      payload.user = await this.usersService.findOne({ id: user.id });
      return await this.postVoteRepository.save(payload);
    } catch (error) {
      throw new BadRequestException(
        new ResponseError({ message: error.toString() }),
      );
    }
  }
}
