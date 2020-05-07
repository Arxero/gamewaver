import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/models';
import { UsersModule } from './users/users.module';
import { User } from './users/models';
import { AuthModule } from './auth/auth.module';

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
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
