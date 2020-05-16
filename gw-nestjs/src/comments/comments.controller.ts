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
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentCreateCmd } from './models/cmd/comment-create.cmd';
import { IResponseBase, ResponseSuccess } from 'src/common/models/response';
import { Comment } from './models/comment.entity';
import { GetCommentDto } from './models/dto/get-comment.dto';
import { QueryParams, QueryRequest } from 'src/common/models/query-request';
import { PagedData } from 'src/common/models/paged-data';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CommentUpdateCmd } from './models/cmd/comment-update.cmd';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  async create(
    @Param('postId') postId: string,
    @Body() createModel: CommentCreateCmd,
  ): Promise<IResponseBase> {
    const result = await this.commentsService.create(
      postId,
      new Comment(createModel),
    );
    return new ResponseSuccess<GetCommentDto>({
      result: new GetCommentDto(result),
    });
  }

  @Get()
  async findAll(@Query() queryParams: QueryParams): Promise<IResponseBase> {
    const queryRequest = new QueryRequest(queryParams);
    const result = await this.commentsService.findAll(queryRequest);
    return new ResponseSuccess<PagedData<GetCommentDto>>({ result });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IResponseBase> {
    const result = new GetCommentDto(
      await this.commentsService.findOne({ id }),
    );
    return new ResponseSuccess<GetCommentDto>({ result });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string): Promise<IResponseBase> {
    const result = await this.commentsService.delete({ id });
    return new ResponseSuccess<GetCommentDto>({
      result: new GetCommentDto(result),
    });
  }
}
