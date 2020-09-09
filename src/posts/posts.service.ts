import { VoteType } from './../votes/models/postVote.entity';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Inject,
  Scope,
  ForbiddenException,
} from '@nestjs/common';
import { Post } from './models/post.entity';
import { Repository, DeepPartial, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ResponseError } from 'src/common/models/response';
import { QueryRequest } from 'src/common/models/query-request';
import { PagedData } from 'src/common/models/paged-data';
import { GetPostDto } from './models/dto/get-post.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TokenUserPayloadDto } from 'src/auth/models/dto/token-user-payload.dto';
import { UserRole } from 'src/users/models/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private usersService: UsersService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(payload: Post): Promise<Post> {
    try {
      const user = new TokenUserPayloadDto(this.request.user);
      payload.author = await this.usersService.findOne({ id: user.id });
      return await this.postsRepository.save(payload);
    } catch (error) {
      throw new BadRequestException(
        new ResponseError({ message: error.toString() }),
      );
    }
  }

  async findAll(queryRequest: QueryRequest): Promise<PagedData<GetPostDto>> {
    if (Object.keys(queryRequest.sorting.order).includes('comments')) {
      return await this.sortByComments(queryRequest);
    }

    const [items, total] = await this.postsRepository.findAndCount({
      order: queryRequest.sorting.order,
      where: queryRequest.filter,
      skip: queryRequest.paging.skip,
      take: queryRequest.paging.take,
      relations: ['author'],
    });

    return new PagedData<GetPostDto>(
      items.map(x => new GetPostDto(x)),
      total,
    );
  }

  async sortByComments(
    queryRequest: QueryRequest,
  ): Promise<PagedData<GetPostDto>> {
    const fromTo = queryRequest.filters ? queryRequest.filters[0].searchValue.split(',') : [];
    const where = queryRequest.filters ? `WHERE (createdAt BETWEEN '${fromTo[0]}' AND '${fromTo[1]}')` : '';
    const total = await this.postsRepository.count();
    const items = (await getRepository(Post).query(`SELECT *
      FROM posts x
      INNER JOIN (SELECT postId, COUNT(*) total FROM comments GROUP BY postId) y ON y.postId = x.id
      ${where}
      ORDER 
        BY total DESC
        LIMIT ${queryRequest.paging.take}
        OFFSET ${queryRequest.paging.skip}`)) as Post[];

    return new PagedData<GetPostDto>(
      items.map(x => new GetPostDto(x)),
      total,
    );
  }

  async findOne(params: DeepPartial<Post>): Promise<Post> {
    let post: Post;
    try {
      post = await this.postsRepository.findOne(params, {
        relations: ['author'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
    if (!post)
      throw new NotFoundException(new ResponseError({ message: 'Not Found' }));
    return post;
  }

  async update(id: string, model: Post): Promise<Post> {
    const post = await this.findOne({ id });
    this.authorize(post);
    post.content = model.content;
    post.category = model.category;
    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  async updateVotes(id: string, type: VoteType, isAdd: boolean): Promise<Post> {
    const post = await this.findOne({ id });
    switch (type) {
      case VoteType.Upvote:
        post.upvotes = isAdd
          ? post.upvotes + 1
          : post.upvotes > 0
          ? post.upvotes - 1
          : post.upvotes;
        break;
      case VoteType.DownVote:
        post.downvotes = isAdd
          ? post.downvotes + 1
          : post.downvotes > 0
          ? post.downvotes - 1
          : post.downvotes;
        break;
    }

    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  async delete(params: DeepPartial<Post>): Promise<Post> {
    const post = await this.findOne(params);
    this.authorize(post);
    try {
      return await this.postsRepository.remove(post);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  private authorize(entity: Post) {
    const tokenUser = new TokenUserPayloadDto(this.request.user);
    if (
      tokenUser.id !== entity.author.id &&
      tokenUser.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException();
    }
  }
}
