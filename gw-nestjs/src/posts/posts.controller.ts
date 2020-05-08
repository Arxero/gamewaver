import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostCreateDto, PostUpdateDto } from './models/post.dtos';
import {Post as PostModel} from './models/post.entity';
import { PostQuery } from './models/post.query';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post(':id')
  create(@Param('id') id: string, @Body() createModel: PostCreateDto): Promise<PostModel> {
    return this.postsService.create(id, createModel);
  }

  @ UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: PostQuery): Promise<PostModel[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateModel: PostUpdateDto): Promise<PostModel> {
    return this.postsService.update(id, updateModel);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<PostModel>  {
    return this.postsService.delete(id);
  }
}
