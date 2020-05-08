import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole, UserStatus } from 'src/users/models/user.entity';
import { environment } from 'environment/environment.dev';
import { TokenDto } from './models/dto/token.dto';
import { TokenUserPayloadDto } from './models/dto/token-user-payload.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}


  async signUp(user: User) {
    user.role = UserRole.USER;
    user.status = UserStatus.PENDING;
    user = await this.usersService.create(user);
    return this.createToken(user);
  }


  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ username });
    const isValid = await bcrypt.compare(pass, user.password);

    console.log(user);
    console.log(isValid);
    if (user && isValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    console.log(user);
    const payload = { username: user.username, sub: user.id };
    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: this.jwtService.sign(payload),
    };
  }


  createToken(signedUser: User) {
    const expiresIn = environment.JWT_EXPIRATION;
    const secretOrKey = environment.SECRET_KEY;
    const user = new TokenUserPayloadDto(signedUser);
    const userPOJO = JSON.parse(JSON.stringify(user));
    const accessToken = jwt.sign(userPOJO, secretOrKey, { expiresIn });
    return new TokenDto({
      expiresIn,
      accessToken,
    });
  }
}
