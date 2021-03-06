import { Options } from 'nodemailer/lib/mailer';
import { User } from 'src/users/models/user.entity';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

export enum TypeEmail {
  UNKNOWN = 'unknown',
  RESET_PASSWORD = 'reset_password',
  CONRIM_EMAIL = 'confirm_email',
}

export class SendEmailCmd implements Options {
  constructor(typeEmail: TypeEmail, user: User, token: string, url: string) {
    switch (typeEmail) {
      case TypeEmail.RESET_PASSWORD:
        this.subject = 'Frogotten Password';
        this.htmlContent = 'If you requested to reset your password';
        this.concreteLink = '/auth/forgotten-password?resetPasswordToken=';
        this.resultMessage = `Password reset link has been sent to ${user.email}`;
        break;
      case TypeEmail.CONRIM_EMAIL:
        this.subject = 'Email confrimation';
        this.htmlContent = 'Confirm your email by clicking the link bellow';
        this.concreteLink = '/auth/verify-email/';
        this.resultMessage = `Email conrfimation link was sent to **${user.email}**`;
        break;
    }

    this.from = '"Gamewaver" <' + 'Gamewaver' + '>';
    this.to = user.email;
    this.html =
      `Hey ${user.username}! <br><br>${this.htmlContent}<br><br>` +
      `<a href=${url}${this.concreteLink}${token}>Click here</a>`;
  }

  private htmlContent: string;
  private concreteLink: string;
  resultMessage: string;

  from: string;
  to: string;
  subject: string;
  html: string;
}
