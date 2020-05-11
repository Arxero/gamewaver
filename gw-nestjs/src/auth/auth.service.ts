import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole, UserStatus } from 'src/users/models/user.entity';
import { environment } from 'environment/environment.dev';
import { TokenDto } from './models/dto/token.dto';
import { TokenUserPayloadDto } from './models/dto/token-user-payload.dto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordCmd } from './models/cmd/change-password.cmd';
import { SentEmailDto } from './models/dto/sent-email.dto';
import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import { SendEmailCmd, TypeEmail } from './models/cmd/send-email.cmd';

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
    return await this.sendEmail(user, TypeEmail.CONRIM_EMAIL);
  }

  async validateUser(username: string, pass: string): Promise<User> {
    console.log('Validating user');
    const user = await this.usersService.findOne({ username });
    const isValid = await bcrypt.compare(pass, user.password);

    if (user && isValid) {
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }

  async login(user: User) {
    // console.log('login...');
    return this.createToken(user);
  }

  private createToken(signedUser: User): TokenDto {
    // console.log('generating token...');
    const expiresIn = +this.configService.get<number>('JWT_EXPIRATION');
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

  async sendEmail(user: User, typeEmail: TypeEmail): Promise<SentEmailDto> {
    const token = this.createEmailToken(user);
    const emailBody = new SendEmailCmd(typeEmail, user, token);
    try {
      await this.createTransporter().sendMail(emailBody);
      return new SentEmailDto({
        username: user.username,
        message: emailBody.resultMessage,
        token,
      });
    } catch (error) {
      throw new BadRequestException(`Error sending the email.`);
    }
  }

  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync(token);
  }

  private createTransporter(): Mail {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'stanislav.ganev93@gmail.com', // generated ethereal user
        pass: '', // generated ethereal password
      },
    });
  }
}
