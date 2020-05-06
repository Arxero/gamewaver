import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';

import { PostsService } from './posts.service';
import { PostCreateDto, PostQuery, Post as PostModel, PostUpdateDto } from './models';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  // @Post()
  // create(@Body() postCreateDto: PostCreateDto): Promise<PostModel> {
  //   return this.postsService.create(postCreateDto);
  // }

  // @Get()
  // findAll(@Query() query: PostQuery): Promise<PostModel[]> {
  //   return this.postsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<PostModel> {
  //   return this.postsService.findOne(id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateCatDto: PostUpdateDto): Promise<PostModel> {
  //   return this.postsService.update(id, updateCatDto);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: string): Promise<PostModel>  {
  //   return this.postsService.delete(id);
  // }
}
