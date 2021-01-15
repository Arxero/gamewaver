import { BaseCmd } from './../shared/models/common';
export interface ForgotPasswordCmd {
  email: string;
}

export interface LoginCmd {
  username: string;
  password: string;
}
export interface ResetPasswordCmd {
  password: string;
  token: string;
}

export interface SignUpCmd extends BaseCmd {
  username: string;
  password: string;
  email: string;
}

export interface SentEmailDto {
  message: string;
  username: string;
}

export interface TokenDto {
  expiresIn: number;
  accessToken: string;
}

export interface TokenLocal extends TokenDto {
  savedAt: number;
}
