import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserStatus } from 'src/users/models/user.entity';
import { AuthJwtService } from '../auth-jwt.service';
import { ModuleRef, ContextIdFactory } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private moduleRef: ModuleRef,
  ) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(request: Request, username: string, password: string): Promise<any> {
    const contextId = ContextIdFactory.getByRequest(request);
    const authJwtService = await this.moduleRef.resolve(AuthJwtService, contextId);
    const user = await authJwtService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Wrong username or password');
    }

    if (user.status == UserStatus.PENDING) {
      throw new BadRequestException('User email not confirmed');
    }
    return user;
  }
}
