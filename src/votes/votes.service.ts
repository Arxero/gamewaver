import { BaseService } from './../common/shared/base.service';
import { IUser } from './../users/models/user.entity';
import { PostsService } from 'src/posts/posts.service';
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
import { Repository, DeepPartial, getRepository, getManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseError } from 'src/common/models/response';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TokenUserPayloadDto } from 'src/auth/models/dto/token-user-payload.dto';
import { UserRole, User } from 'src/users/models/user.entity';
import { GetVotesCountDto } from './models/dto/get-votes-count.dto';
import { PostVoteCmd } from './models/cmd/create-vote.cmd';

@Injectable()
export class VotesService extends BaseService {
  constructor(
    @InjectRepository(PostVote)
    private postVoteRepository: Repository<PostVote>,
    @Inject(REQUEST) private request: Request,
  ) {
    super();
  }

  async create(payload: PostVoteCmd): Promise<PostVote> {
    try {
      const user = new TokenUserPayloadDto(this.request.user as IUser);
      const postVote = new PostVote({
        type: payload.type,
        post: { id: payload.postId } as Post,
        user: { id: user.id } as User,
      });
      return await this.postVoteRepository.save(postVote);
    } catch (error) {
      throw new BadRequestException(
        new ResponseError({ message: error.toString() }),
      );
    }
  }

  async findCountByPostIds(ids: string[]): Promise<GetVotesCountDto[]> {
    try {
      const result: GetVotesCountDto[] = [];
      for (const id of ids) {
        const upvotes = await this.postVoteRepository.count({
          where: { post: { id }, type: VoteType.Upvote },
        });

        const downvotes = await this.postVoteRepository.count({
          where: { post: { id }, type: VoteType.DownVote },
        });
        result.push(new GetVotesCountDto({ upvotes, downvotes, postId: id }));
      }
      return result;
    } catch (error) {
      throw new BadRequestException(
        new ResponseError({ message: error.toString() }),
      );
    }
  }

  async findMany(postIds: string[]): Promise<PostVote[]> {
    const conditions = postIds.map(id => {
      return { post: { id }, user: { id: (this.request.user as User).id } };
    });
    
    try {
      return await this.postVoteRepository.find({
        where: conditions,
        relations: ['user', 'post'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
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

  async update(id: string, model: PostVoteCmd): Promise<PostVote> {
    const vote = await this.findOne({ id });
    this.authorize(vote.user.id, this.request);
    vote.type = model.type;
    try {
      const result = await this.postVoteRepository.save(vote);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  async delete(params: DeepPartial<PostVote>): Promise<PostVote> {
    const vote = await this.findOne(params);
    this.authorize(vote.user.id, this.request);
    try {
      const result = await this.postVoteRepository.remove(vote);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }
}
