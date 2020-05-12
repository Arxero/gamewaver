import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserStatus } from 'src/users/models/user.entity';
import { AuthJwtService } from '../auth-jwt.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authJwtService: AuthJwtService,) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authJwtService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.status == UserStatus.PENDING) {
      throw new BadRequestException('User email not confirmed');
    }
    return user;
  }
}
