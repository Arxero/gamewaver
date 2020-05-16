import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
  Inject,
  Scope,
} from '@nestjs/common';
import { Comment } from './models/comment.entity';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { ResponseError } from 'src/common/models/response';
import { PostsService } from 'src/posts/posts.service';
import { QueryRequest } from 'src/common/models/query-request';
import { PagedData } from 'src/common/models/paged-data';
import { GetCommentDto } from './models/dto/get-comment.dto';
import { TokenUserPayloadDto } from 'src/auth/models/dto/token-user-payload.dto';
import { UserRole } from 'src/users/models/user.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    private usersService: UsersService,
    private postsService: PostsService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(postId: string, payload: Comment): Promise<Comment> {
    try {
      const user = new TokenUserPayloadDto(this.request.user);
      payload.author = await this.usersService.findOne({ id: user.id });
      payload.post = await this.postsService.findOne({ id: postId });
      return await this.commentsRepository.save(payload);
    } catch (error) {
      throw new BadRequestException(
        new ResponseError({ message: error.toString() }),
      );
    }
  }

  async findAll(queryRequest: QueryRequest): Promise<PagedData<GetCommentDto>> {
    const [items, total] = await this.commentsRepository.findAndCount({
      order: queryRequest.sorting.order,
      where: queryRequest.filter,
      skip: queryRequest.paging.skip,
      take: queryRequest.paging.take,
      relations: ['author'],
    });

    return new PagedData<GetCommentDto>(
      items.map(x => new GetCommentDto(x)),
      total,
    );
  }

  async findOne(params: DeepPartial<Comment>): Promise<Comment> {
    let comment: Comment;
    try {
      comment = await this.commentsRepository.findOne(params, {
        relations: ['author'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
    if (!comment)
      throw new NotFoundException(new ResponseError({ message: 'Not Found' }));
    return comment;
  }

  async update(id: string, model: Comment): Promise<Comment> {
    const comment = await this.findOne({ id });
    this.authorize(comment);
    comment.content = model.content;
    try {
      return await this.commentsRepository.save(comment);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  async delete(params: DeepPartial<Comment>): Promise<Comment> {
    const comment = await this.findOne(params);
    this.authorize(comment);
    try {
      return await this.commentsRepository.remove(comment);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  private authorize(entity: Comment) {
    const tokenUser = new TokenUserPayloadDto(this.request.user);
    if (
      tokenUser.id !== entity.author.id &&
      tokenUser.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException();
    }
  }
}
