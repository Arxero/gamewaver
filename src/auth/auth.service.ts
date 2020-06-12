import {
  Injectable,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User, UserRole, UserStatus } from 'src/users/models/user.entity';
import { ConfigService } from '@nestjs/config';
import { SentEmailDto } from './models/dto/sent-email.dto';
import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import { SendEmailCmd, TypeEmail } from './models/cmd/send-email.cmd';
import { AuthJwtService } from './auth-jwt.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TokenDto } from './models/dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private authJwtService: AuthJwtService,
    // @Inject(REQUEST) private request: Request
  ) {}

  async signUp(user: User): Promise<TokenDto> {
    user.role = UserRole.USER;
    user.status = UserStatus.CONFIRM;
    user = await this.usersService.create(user);
    // return await this.sendEmail(user, TypeEmail.CONRIM_EMAIL);
    return this.authJwtService.createToken(user);
  }

  async login(user: User): Promise<TokenDto> {
    return this.authJwtService.createToken(user);
  }

  // paused until I got registration without email confrimation to work
  async sendEmail(user: User, typeEmail: TypeEmail): Promise<SentEmailDto> {
    const token = this.authJwtService.createEmailToken(user);
    const emailBody = new SendEmailCmd(typeEmail, user, token);
    try {
      await this.createTransporter().sendMail(emailBody);
      return new SentEmailDto({
        username: user.username,
        message: emailBody.resultMessage,
        token,
      });
    } catch (error) {
      throw new BadRequestException(error.toString(), `Error sending the email.`);
    }
  }

  async renewToken(token: string) {
    try {
      const result = await this.authJwtService.verifyToken(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const decodedUser = await this.authJwtService.decodeToken(token);
        return this.authJwtService.createToken(decodedUser as User);
      }
      
    }
  }

  private createTransporter(): Mail {
    return nodemailer.createTransport({
      host: this.configService.get<string>('mail.host'),
      port: this.configService.get<number>('mail.port'),
      secure: this.configService.get<boolean>('mail.secure'),
      auth: {
        user: this.configService.get<string>('mail.user'),
        pass: this.configService.get<string>('mail.pass'),
      },
    });
  }
}
