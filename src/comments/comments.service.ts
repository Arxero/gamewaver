import { BaseService } from './../common/shared/base.service';
import { Post } from 'src/posts/models/post.entity';
import { IUser, User } from './../users/models/user.entity';
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
import { GetCommentsCountDto } from './models/dto/get-comments-count.dto';
import { ICommentCmd } from './models/cmd/comment-create.cmd';

@Injectable()
export class CommentsService extends BaseService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    private usersService: UsersService,
    private postsService: PostsService,
    @Inject(REQUEST) private request: Request,
  ) {
    super();
  }

  async create(postId: string, payload: ICommentCmd): Promise<Comment> {
    try {
      const user = new TokenUserPayloadDto(this.request.user as IUser);
      const comment = new Comment({
        content: payload.content,
        author: { id: user.id } as User,
        post: { id: postId } as Post,
      });
      return await this.commentsRepository.save(comment);
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
      relations: ['author', 'post'],
    });

    return new PagedData<GetCommentDto>(
      items.map(x => new GetCommentDto(x)),
      total,
    );
  }

  async findCountByPostIds(ids: string[]): Promise<GetCommentsCountDto[]> {
    try {
      const result: GetCommentsCountDto[] = [];
      for (const id of ids) {
        const count = await this.commentsRepository.count({
          where: [{ post: { id } }],
        });
        result.push(new GetCommentsCountDto({ postid: id, count }));
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  async findOne(params: DeepPartial<Comment>): Promise<Comment> {
    let comment: Comment;
    try {
      comment = await this.commentsRepository.findOne(params, {
        relations: ['author', 'post'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
    if (!comment)
      throw new NotFoundException(new ResponseError({ message: 'Not Found' }));
    return comment;
  }

  async update(id: string, model: ICommentCmd): Promise<Comment> {
    const comment = await this.findOne({ id });
    this.authorize(comment.author.id, this.request);
    comment.content = model.content;
    try {
      return await this.commentsRepository.save(comment);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  async delete(params: DeepPartial<Comment>): Promise<Comment> {
    const comment = await this.findOne(params);
    this.authorize(comment.author.id, this.request);
    try {
      return await this.commentsRepository.remove(comment);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }
}
