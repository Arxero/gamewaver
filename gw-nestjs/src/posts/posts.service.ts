import { Injectable, forwardRef } from '@nestjs/common';
import { Post } from './models/post.entity';
import { PostCreateDto, PostUpdateDto } from './models/post.dtos';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async create(model: PostCreateDto) {
    const post = new Post();
    post.content = model.content;
    post.createdAt = new Date(Date.now());
    post.updatedAt = new Date(Date.now());
    post.title = model.title;
    return await this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find();
  }

  async findOne(id: string): Promise<Post> {
    return await this.postsRepository.findOne(+id);
  }

  async update(id: string, model: PostUpdateDto) {
    const post = await this.postsRepository.findOne(id);
    post.content = model.content;
    post.isPublished = model.isPublished;
    post.title = model.title;
    return await this.postsRepository.save(post);
  }

  async delete(id: string): Promise<Post>  {
    const post = await this.postsRepository.findOne(id);
    return await this.postsRepository.remove(post);
  }
}
