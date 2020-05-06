import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/models';
import { UsersModule } from './users/users.module';
import { User } from './users/models';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    // forwardRef(() => PostsModule),
    // forwardRef(() => UsersModule)
    PostsModule,
    UsersModule,
  ],
})
export class AppModule {}
