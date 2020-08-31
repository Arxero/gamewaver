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

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(PostVote)
    private postVoteRepository: Repository<PostVote>,
    @Inject(REQUEST) private request: Request,
    private postsService: PostsService
    
  ) {}

  async create(payload: PostVote, postId: string): Promise<PostVote> {
    try {
      const user = new TokenUserPayloadDto(this.request.user);
      payload.post = { id: postId } as Post;
      payload.user = { id: user.id } as User;
      const result = await this.postVoteRepository.save(payload);
      await this.postsService.updateVotes(postId, payload.type, true);
      return result;
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
          where: {post: { id }, type: VoteType.Upvote },
        });

        const downvotes = await this.postVoteRepository.count({
          where: {post: { id }, type: VoteType.DownVote }
        });
        result.push(new GetVotesCountDto({upvotes, downvotes, postId: id}))
      };
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

  async update(id: string, model: PostVote): Promise<PostVote> {
    const vote = await this.findOne({ id });
    this.authorize(vote);
    vote.type = model.type;
    try {
      const result = await this.postVoteRepository.save(vote);
      await this.postsService.updateVotes(vote.post.id, vote.type, true);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  async delete(params: DeepPartial<PostVote>): Promise<PostVote> {
    const vote = await this.findOne(params);
    this.authorize(vote);
    try {
      const result = await this.postVoteRepository.remove(vote);
      await this.postsService.updateVotes(vote.post.id, vote.type, false);
      return result;
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
