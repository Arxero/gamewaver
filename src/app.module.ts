import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/models/user.entity';
import { Post } from './posts/models/post.entity';
import { Comment } from './comments/models/comment.entity';
import { CommentsModule } from './comments/comments.module';
import { VotesModule } from './votes/votes.module';
import configuration from './config/configuration';
import { PostVote } from './votes/models/postVote.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.database'),
        entities: [Post, User, Comment, PostVote],
        synchronize: true,
        charset: 'utf8mb4',
        timezone: 'Z',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    VotesModule,
  ],
})
export class AppModule {}
