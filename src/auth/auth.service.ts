import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User, UserRole, UserStatus } from 'src/users/models/user.entity';
import { ConfigService } from '@nestjs/config';
import { SentEmailDto } from './models/dto/sent-email.dto';
import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import { SendEmailCmd, TypeEmail } from './models/cmd/send-email.cmd';
import { AuthJwtService } from './auth-jwt.service';
import { TokenDto } from './models/dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private authJwtService: AuthJwtService,
  ) {}

  async signUp(user: User): Promise<SentEmailDto> {
    user.role = UserRole.USER;
    user.status = UserStatus.PENDING;
    user = await this.usersService.create(user);
    return await this.sendEmail(user, TypeEmail.CONRIM_EMAIL);
  }

  async login(user: User): Promise<TokenDto> {
    return this.authJwtService.createToken(user);
  }

  async sendEmail(user: User, typeEmail: TypeEmail): Promise<SentEmailDto> {
    let emailBody;
    try {
      const token = this.authJwtService.createEmailToken(user);
      const hostUrl = `${this.configService.get<string>('host.url')}:${this.configService.get<string>('host.port')}`;
      const webUrl = `${this.configService.get<string>('web.url')}:${this.configService.get<string>('web.port')}`;
      const url  = typeEmail === TypeEmail.CONRIM_EMAIL ? hostUrl : webUrl;
      emailBody = new SendEmailCmd(typeEmail, user, token, url);
      console.log('token ' + token);
      console.log('hostUrl ' + hostUrl);
      console.log('webUrl ' + webUrl);
      console.log('url ' + url);
      console.log('emailBody ' + JSON.stringify(emailBody));
    } catch (error) {
      throw new BadRequestException(
        error.toString(),
        `Error creating email token.`,
      );
    }
    try {
      await this.createTransporter().sendMail(emailBody);
      return new SentEmailDto({
        username: user.username,
        message: emailBody.resultMessage,
      });
    } catch (error) {
      throw new BadRequestException(
        error.toString(),
        `Error sending the email.`,
      );
    }
  }

  async renewToken(token: string) {
    try {
      await this.authJwtService.verifyToken(token);
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
