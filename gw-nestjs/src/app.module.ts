import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/models/user.entity';
import { Post } from './posts/models/post.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'asdasd',
      database: 'nestjs-typeorm',
      entities: [Post, User],
      synchronize: true,
    }),
    PostsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
