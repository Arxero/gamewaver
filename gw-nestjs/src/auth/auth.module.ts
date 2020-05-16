import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport/jwt.strategy';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthJwtService } from './auth-jwt.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    // forwardRef(() => UsersModule),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, AuthJwtService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
