import { Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { User, UserStatus } from 'src/users/models/user.entity';
import * as bcrypt from 'bcrypt';
import { TokenDto } from './models/dto/token.dto';
import { TokenUserPayloadDto } from './models/dto/token-user-payload.dto';

@Injectable({ scope: Scope.REQUEST })
export class AuthJwtService  {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findOne({ username });
    const isValid = await bcrypt.compare(pass, user.password);

    if (user && isValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }

  createToken(signedUser: User): TokenDto {
    const expiresIn = this.configService.get<number>('jwt.expiration');
    const user = new TokenUserPayloadDto(signedUser);
    const userPOJO = JSON.parse(JSON.stringify(user));
    return new TokenDto({
      expiresIn,
      accessToken: this.jwtService.sign(userPOJO, { expiresIn }),
    });
  }

  createEmailToken(user: User): string {
    const tokenUser = { id: user.id, username: user.username };
    const userPOJO = JSON.parse(JSON.stringify(tokenUser));
    return this.jwtService.sign(userPOJO, { expiresIn: 3600 });
  }

  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync(token);
  }

  async decodeToken(token: string) {
    return await this.jwtService.decode(token);
  }
}
