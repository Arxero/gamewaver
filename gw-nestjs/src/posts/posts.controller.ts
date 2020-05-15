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
  Req,
  SetMetadata,
} from '@nestjs/common';

import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Post as PostModel } from './models/post.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreatePostCmd } from './models/cmd/create-post.cmd';
import { IResponseBase, ResponseSuccess } from 'src/common/models/response';
import { QueryParams, QueryRequest } from 'src/common/models/query-request';
import { PagedData } from 'src/common/models/paged-data';
import { GetPostDto } from './models/dto/get-post.dto';
import { UpdatePostCmd } from './models/cmd/update-post.cmd';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body() createModel: CreatePostCmd,
  ): Promise<IResponseBase> {
    const post = new PostModel(createModel);
    post.author = req.user.id;
    const result = await this.postsService.create(post);
    return new ResponseSuccess<PostModel>({ result });
  }

  @Get()
  async findAll(@Query() queryParams: QueryParams): Promise<IResponseBase> {
    const queryRequest = new QueryRequest(queryParams);
    const result = await this.postsService.findAll(queryRequest);
    return new ResponseSuccess<PagedData<GetPostDto>>({ result });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IResponseBase> {
    const result = new GetPostDto(await this.postsService.findOne({ id }));
    return new ResponseSuccess<GetPostDto>({ result });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @SetMetadata('roles', ['admin'])
  async update(
    @Param('id') id: string,
    @Body() updateModel: UpdatePostCmd,
  ): Promise<IResponseBase> {
    const user = await this.postsService.update(id, new PostModel(updateModel));
    return new ResponseSuccess<GetPostDto>({ result: new GetPostDto(user) });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @SetMetadata('roles', ['admin'])
  async delete(@Param('id') id: string): Promise<IResponseBase> {
    const post = await this.postsService.delete({ id });
    return new ResponseSuccess<GetPostDto>({ result: new GetPostDto(post) });
  }
}
