import {
  Controller,
  UseGuards,
  Post,
  Param,
  Body,
  Req,
  Get,
  Query,
  Put,
  SetMetadata,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentCreateCmd } from './models/cmd/comment-create.cmd';
import { IResponseBase, ResponseSuccess, IResponse } from 'src/common/models/response';
import { Comment } from './models/comment.entity';
import { GetCommentDto } from './models/dto/get-comment.dto';
import { QueryParams, QueryRequest } from 'src/common/models/query-request';
import { PagedData } from 'src/common/models/paged-data';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CommentUpdateCmd } from './models/cmd/comment-update.cmd';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommentsCountQuery } from './models/cmd/comments-count.query';
import { GetCommentsCountDto } from './models/dto/get-comments-count.dto';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  async create(
    @Param('postId') postId: string,
    @Body() createModel: CommentCreateCmd,
  ): Promise<IResponse<GetCommentDto>> {
    const result = await this.commentsService.create(
      postId,
      new Comment(createModel),
    );
    return new ResponseSuccess<GetCommentDto>({
      result: new GetCommentDto(result),
    });
  }

  @ApiQuery({ name: 'sort', description: 'createdAt:desc', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @Get()
  async findAll(@Query() queryParams: QueryParams): Promise<IResponse<PagedData<GetCommentDto>>> {
    const queryRequest = new QueryRequest(queryParams);
    const result = await this.commentsService.findAll(queryRequest);
    return new ResponseSuccess<PagedData<GetCommentDto>>({ result });
  }

  @ApiQuery({ name: 'postIds', required: true, description: `id1,id2` })
  @Get('count')
  async findCountByPostIds(
    @Query(new ValidationPipe({ transform: true })) commentsCountQuery: CommentsCountQuery,
  ): Promise<IResponse<GetCommentsCountDto[]>> {
    const result = await this.commentsService.findCountByPostIds(commentsCountQuery.postIds);
    return new ResponseSuccess<GetCommentsCountDto[]>({ result });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IResponseBase> {
    const result = new GetCommentDto(
      await this.commentsService.findOne({ id }),
    );
    return new ResponseSuccess<GetCommentDto>({ result });
  }


  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateModel: CommentUpdateCmd,
  ): Promise<IResponseBase> {
    const result = await this.commentsService.update(
      id,
      new Comment(updateModel),
    );
    return new ResponseSuccess<GetCommentDto>({
      result: new GetCommentDto(result),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string): Promise<IResponse<GetCommentDto>> {
    const result = await this.commentsService.delete({ id });
    return new ResponseSuccess<GetCommentDto>({
      result: new GetCommentDto(result),
    });
  }
}
