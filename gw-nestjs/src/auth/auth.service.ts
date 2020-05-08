import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole, UserStatus } from 'src/users/models/user.entity';
import { environment } from 'environment/environment.dev';
import { TokenDto } from './models/dto/token.dto';
import { TokenUserPayloadDto } from './models/dto/token-user-payload.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(user: User) {
    user.role = UserRole.USER;
    user.status = UserStatus.PENDING;
    user = await this.usersService.create(user);
    return this.createToken(user);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    console.log('Validating user');
    const user = await this.usersService.findOne({ username });
    const isValid = await bcrypt.compare(pass, user.password);

    if (user && isValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    console.log('login...');
    return this.createToken(user);
  }

  createToken(signedUser: User) {
    console.log('generating token...');
    const expiresIn = +this.configService.get<number>('JWT_EXPIRATION');
    const user = new TokenUserPayloadDto(signedUser);
    const userPOJO = JSON.parse(JSON.stringify(user));
    return new TokenDto({
      expiresIn,
      accessToken: this.jwtService.sign(userPOJO, { expiresIn }),
    });
  }
}
