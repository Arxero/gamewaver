import { Injectable } from '@nestjs/common';
import { Post } from './models/post.entity';
import { PostCreateDto, PostUpdateDto } from './models/post.dtos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  async create(id: string, model: PostCreateDto) {
    const post = new Post();
    const user = await this.usersService.findOne(id);
    post.content = model.content;
    post.title = model.title;
    post.author = user;
    return await this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find({ relations: ['author'] });
  }

  async findOne(id: string): Promise<Post> {
    return await this.postsRepository.findOne(id, { relations: ['author'] });
  }

  async update(id: string, model: PostUpdateDto) {
    const post = await this.postsRepository.findOne(id);
    post.content = model.content;
    post.isPublished = model.isPublished;
    post.title = model.title;
    return await this.postsRepository.save(post);
  }

  async delete(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne(id);
    return await this.postsRepository.remove(post);
  }
}
