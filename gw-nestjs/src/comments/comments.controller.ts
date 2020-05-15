import { Controller, UseGuards, Post, Param, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommentCreateCmd } from './models/cmd/comment-create.cmd';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':userId/:c')
  create(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Body() createModel: CommentCreateCmd,
  ): Promise<any> {
    return null;
    // return this.postsService.create(id, createModel);
  }

  // @Get()
  // findAll(@Query() query: PostQuery): Promise<PostModel[]> {
  //   return this.postsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<PostModel> {
  //   return this.postsService.findOne(id);
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateModel: PostUpdateDto): Promise<PostModel> {
  //   return this.postsService.update(id, updateModel);
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Delete(':id')
  // delete(@Param('id') id: string): Promise<PostModel>  {
  //   return this.postsService.delete(id);
  // }
}
