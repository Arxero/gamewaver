import {
  TokenDto,
  LoginCmd,
  SignUpCmd,
  SentEmailDto,
  TokenLocal,
  ForgotPasswordCmd,
  ResetPasswordCmd,
} from '../auth/auth.models';
import { Injectable } from '@angular/core';
import { User } from '@gamewaver/users';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import { IResponse } from '@gamewaver/shared';

export interface IAuthApiService {
  login(cmd: LoginCmd): Promise<TokenDto>;
  register(cmd: SignUpCmd): Promise<SentEmailDto>;
  getUser(): Promise<IResponse<User>>;
  isLoggedIn(): boolean;
  logout(): void;
  getAuthorizationHeaderValue(): string;
  getToken(): TokenLocal;
  saveToken(token: TokenDto, isSession: boolean): void;
  renewToken(): Promise<TokenDto>;
  forgotPassword(cmd: ForgotPasswordCmd): Promise<IResponse<SentEmailDto>>;
  resetPassword(cmd: ResetPasswordCmd): Promise<IResponse<string>>;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService implements IAuthApiService {
  BASE_URL = `${this.environmentService.apiUrl}auth`;
  accessToken = 'accessToken';

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService,
  ) {}

  login(cmd: LoginCmd): Promise<TokenDto> {
    return this.http.post<TokenDto>(`${this.BASE_URL}/login`, cmd).toPromise();
  }

  register(cmd: SignUpCmd): Promise<SentEmailDto> {
    return this.http
      .post<SentEmailDto>(`${this.BASE_URL}/signup`, cmd)
      .toPromise();
  }

  getUser(): Promise<IResponse<User>> {
    const token = this.getAuthorizationHeaderValue();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', token);
    return this.http
      .get<IResponse<User>>(`${this.BASE_URL}/profile`, { headers })
      .toPromise();
  }

  isLoggedIn(): boolean {
    return (
      sessionStorage.getItem(this.accessToken) !== null ||
      localStorage.getItem(this.accessToken) !== null
    );
  }

  logout(): void {
    sessionStorage.clear();
    localStorage.clear();
  }

  getAuthorizationHeaderValue(): string {
    if (!this.getToken()) {
      return null;
    }
    return `Bearer ${this.getToken().accessToken}`;
  }

  getToken(): TokenLocal {
    if (sessionStorage.getItem(this.accessToken)) {
      return JSON.parse(sessionStorage.getItem(this.accessToken));
    }
    return JSON.parse(localStorage.getItem(this.accessToken));
  }

  saveToken(token: TokenDto, isSession?: boolean): void {
    const tempToken: TokenLocal = { ...token, savedAt: Date.now() };
    if (isSession) {
      sessionStorage.setItem(this.accessToken, JSON.stringify(tempToken));
      return;
    }
    localStorage.setItem(this.accessToken, JSON.stringify(tempToken));
  }

  renewToken(): Promise<TokenDto> {
    const token = this.getToken().accessToken;
    return this.http
      .get<TokenDto>(`${this.BASE_URL}/renew/${token}`)
      .toPromise();
  }

  forgotPassword(cmd: ForgotPasswordCmd): Promise<IResponse<SentEmailDto>> {
    return this.http
      .post<IResponse<SentEmailDto>>(`${this.BASE_URL}/forgot-password`, cmd)
      .toPromise();
  }

  resetPassword(cmd: ResetPasswordCmd): Promise<IResponse<string>> {
    return this.http
      .post<IResponse<string>>(`${this.BASE_URL}/reset-password`, cmd)
      .toPromise();
  }
}
