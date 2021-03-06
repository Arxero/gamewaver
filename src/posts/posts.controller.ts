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
import {
  IResponseBase,
  ResponseSuccess,
  IResponse,
} from 'src/common/models/response';
import { QueryParams, QueryRequest } from 'src/common/models/query-request';
import { PagedData } from 'src/common/models/paged-data';
import { GetPostDto } from './models/dto/get-post.dto';
import { UpdatePostCmd } from './models/cmd/update-post.cmd';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ApiTags,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles('admin', 'user')
  async create(
    @Body() createModel: CreatePostCmd,
  ): Promise<IResponse<GetPostDto>> {
    const result = await this.postsService.create(createModel);
    return new ResponseSuccess<GetPostDto>({ result: new GetPostDto(result) });
  }

  @ApiQuery({ name: 'sort', description: 'createdAt:desc', required: false })
  @ApiQuery({
    name: 'filters[createdAt][between]',
    description: 'filters[createdAt][between]=2020-05-09,2020-05-10,date',
    required: false,
  })
  @ApiQuery({
    name: 'votes',
    description: 'get posts by user voted: filters[votes][in]=${userId}',
    required: false,
  })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @Get()
  async findAll(
    @Query() queryParams: QueryParams,
  ): Promise<IResponse<PagedData<GetPostDto>>> {
    const queryRequest = new QueryRequest(queryParams);
    const result = await this.postsService.findAll(queryRequest);
    return new ResponseSuccess<PagedData<GetPostDto>>({ result });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IResponse<GetPostDto>> {
    const post = await this.postsService.findOne({ id });
    const result = new GetPostDto(post);
    return new ResponseSuccess<GetPostDto>({ result });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @Roles('admin', 'user')
  async update(
    @Param('id') id: string,
    @Body() updateModel: UpdatePostCmd,
  ): Promise<IResponse<GetPostDto>> {
    const result = await this.postsService.update(id, updateModel);
    return new ResponseSuccess<GetPostDto>({ result: new GetPostDto(result) });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('admin', 'user')
  async delete(@Param('id') id: string): Promise<IResponse<GetPostDto>> {
    const result = await this.postsService.delete({ id });
    return new ResponseSuccess<GetPostDto>({ result: new GetPostDto(result) });
  }
}
