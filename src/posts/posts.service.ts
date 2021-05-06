import { IUser } from './../users/models/user.entity';
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
import { Repository, DeepPartial, getRepository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ResponseError } from 'src/common/models/response';
import { QueryRequest } from 'src/common/models/query-request';
import { PagedData } from 'src/common/models/paged-data';
import { GetPostDto, IPostDtoEx, GetPostDtoEx } from './models/dto/get-post.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TokenUserPayloadDto } from 'src/auth/models/dto/token-user-payload.dto';
import { UserRole, User } from 'src/users/models/user.entity';
import { SimpleQueryBuilder } from '../common/models/simple-query.builder';
import { IPostCmd } from './models/cmd/create-post.cmd';
import { BaseService } from '../common/shared/base.service';

@Injectable()
export class PostsService extends BaseService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private usersService: UsersService,
    @Inject(REQUEST) private request: Request,
  ) {
    super();
  }

  async create(payload: IPostCmd): Promise<Post> {
    try {
      const user = new TokenUserPayloadDto(this.request.user as IUser);
      const post = new Post({
        content: payload.content,
        category: payload.category,
        author: { id: user.id } as User,
      });
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new BadRequestException(new ResponseError({ message: error.toString() }));
    }
  }

  async findAll(queryRequest: QueryRequest): Promise<PagedData<GetPostDto>> {
    const sqb = new SimpleQueryBuilder().select('*', 'x').from('posts');
    const userId = queryRequest.filters?.find(x => x.fieldName === 'userId');
    const commentAuthor = queryRequest.filters?.find(x => x.fieldName === 'commentAuthor');

    if (userId) {
      sqb.join(
        'INNER',
        ['postId', 'userId', 'createdAt AS voteCreated'],
        null,
        'post_votes',
        'v1',
        `v1.postId = x.id AND userId = '${userId.searchValue}'`,
      );
    } else if (commentAuthor) {
      sqb.join(
        'INNER',
        ['postId', 'authorId AS commentAuthor', 'createdAt AS commentCreated'],
        'commentAuthor, postId',
        'comments',
        'c1',
        `c1.postId = x.id AND commentAuthor = '${commentAuthor.searchValue}'`,
      );
    }

    sqb
      .join(
        'LEFT',
        [
          'postId',
          'type',
          'COUNT(IF(type = "upvote", 1, null)) upvotes',
          'COUNT(IF(type = "downvote", 1, null)) downvotes',
        ],
        'postId',
        'post_votes',
        'v',
        'v.postId = x.id',
      )
      .join(
        'LEFT',
        ['postId', 'COUNT(*) comments'],
        'postId',
        'comments',
        'c',
        'c.postId = x.id',
      )
      .join(
        'LEFT',
        ['role', 'avatar', 'username', 'id AS postAuthorId'],
        null,
        'users',
        'u',
        'u.postAuthorId = x.authorId',
      )
      .where(queryRequest.filters ? queryRequest.filters[0].filterSql : '')
      .orderBy(queryRequest.sorting.order)
      .paging(queryRequest.paging.take, queryRequest.paging.skip);

    const items = (await this.postsRepository.query(sqb.build())) as IPostDtoEx[];

    const [{ total }] = await this.postsRepository.query(
      sqb
        .select('COUNT(*) as total', '')
        .paging(1)
        .build(),
    );

    return new PagedData<GetPostDtoEx>(
      items.map(x => new GetPostDtoEx(x)),
      Number(total),
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
    if (!post) throw new NotFoundException(new ResponseError({ message: 'Not Found' }));
    return post;
  }

  async update(id: string, model: IPostCmd): Promise<Post> {
    const post = await this.findOne({ id });
    this.authorize(post.author.id, this.request);
    post.content = model.content;
    post.category = model.category;
    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  async delete(params: DeepPartial<Post>): Promise<Post> {
    const post = await this.findOne(params);
    this.authorize(post.author.id, this.request);
    try {
      return await this.postsRepository.remove(post);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }
}
