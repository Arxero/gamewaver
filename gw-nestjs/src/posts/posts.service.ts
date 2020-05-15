import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Post } from './models/post.entity';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ResponseError } from 'src/common/models/response';
import { QueryRequest } from 'src/common/models/query-request';
import { PagedData } from 'src/common/models/paged-data';
import { GetPostDto } from './models/dto/get-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  async create(payload: Post): Promise<Post> {
    try {
      return await this.postsRepository.save(payload);
    } catch (error) {
      throw new BadRequestException(
        new ResponseError({ message: error.toString() }),
      );
    }
  }

  async findAll(queryRequest: QueryRequest): Promise<PagedData<GetPostDto>> {
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

  async update(id: string, model: Post) {
    const post = await this.findOne({ id });
    post.content = model.content;
    post.title = model.title;
    post.isPublished = model.isPublished;
    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }

  async delete(params: DeepPartial<Post>): Promise<Post> {
    const post = await this.findOne(params);
    try {
      return await this.postsRepository.remove(post);
    } catch (error) {
      throw new InternalServerErrorException(error.toString());
    }
  }
}
