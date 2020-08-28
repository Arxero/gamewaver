import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Post } from './models/post.entity';
import { VotesModule } from 'src/votes/votes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UsersModule, VotesModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
