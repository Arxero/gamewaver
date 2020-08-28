import { Post } from 'src/posts/models/post.entity';
import { PostVote, VoteType } from './models/postVote.entity';
import {
  Injectable,
  BadRequestException,
  Inject,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseError } from 'src/common/models/response';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TokenUserPayloadDto } from 'src/auth/models/dto/token-user-payload.dto';
import { UsersService } from 'src/users/users.service';
import { UserRole, User } from 'src/users/models/user.entity';
import { PostsService } from 'src/posts/posts.service';
import { GetVotesCountDto } from './models/dto/get-votes-count.dto';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(PostVote)
    private postVoteRepository: Repository<PostVote>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(payload: PostVote, postId: string): Promise<PostVote> {
    try {
      const user = new TokenUserPayloadDto(this.request.user);
      payload.post = { id: postId } as Post;
      payload.user = { id: user.id } as User;
      return await this.postVoteRepository.save(payload);
    } catch (error) {
      throw new BadRequestException(
        new ResponseError({ message: error.toString() }),
      );
    }
  }

  async findCountByPostId(id: string): Promise<GetVotesCountDto> {
    try {
      const upvotes =  await this.postVoteRepository.count({
        where: [{ post: { id }, type: VoteType.Upvote }],
      });

      const downvotes =  await this.postVoteRepository.count({
        where: [{ post: { id }, type: VoteType.DownVote }],
      });

      return new GetVotesCountDto({ upvotes, downvotes, postId: id })
    } catch (error) {
      throw new BadRequestException(
        new ResponseError({ message: error.toString() }),
      );
    }
  }

  async findOne(params: DeepPartial<PostVote>): Promise<PostVote> {
    let post: PostVote;
    try {
      post = await this.postVoteRepository.findOne(params, {
        relations: ['user', 'post'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
    if (!post)
      throw new NotFoundException(new ResponseError({ message: 'Not Found' }));
    return post;
  }

  async delete(params: DeepPartial<PostVote>): Promise<PostVote> {
    const vote = await this.findOne(params);
    this.authorize(vote);
    try {
      return await this.postVoteRepository.remove(vote);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  private authorize(entity: PostVote) {
    const tokenUser = new TokenUserPayloadDto(this.request.user);
    if (tokenUser.id !== entity.user.id && tokenUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException();
    }
  }
}
