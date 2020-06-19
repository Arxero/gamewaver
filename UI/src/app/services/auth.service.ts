import { Injectable } from '@angular/core';
import { LoginCmd } from '../auth/models/cmd/login.cmd';
import { TokenDto, TokenLocal } from '../auth/models/dto/token.dto';
import { SignUpCmd } from '../auth/models/cmd/sign-up.cmd';
import { IResponse } from '../shared/models/response';
import { User } from '../users/models/dto/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from './environment.service';
import { SentEmailDto } from '../auth/models/dto/sent-email.dto';


export interface IAuthService {
  login(cmd: LoginCmd): Promise<TokenDto>;
  register(cmd: SignUpCmd): Promise<SentEmailDto>;
  getUser(): Promise<IResponse<User>>;
  isLoggedIn(): boolean;
  logout(): void;
  getAuthorizationHeaderValue(): string;
  getToken(): TokenLocal;
  saveToken(token: TokenDto, isSession: boolean): void;
  renewToken(): Promise<TokenDto>;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements IAuthService {
  BASE_URL = `${this.environmentService.apiUrl}auth`;
  accessToken = 'accessToken';

  constructor(
    // @Inject('HttpClientService') private httpClient: HttpClientService,
    private http: HttpClient,
    private environmentService: EnvironmentService,
  ) {}

  login(cmd: LoginCmd): Promise<TokenDto> {
    return this.http.post<TokenDto>(`${this.BASE_URL}/login`, cmd).toPromise();
  }

  register(cmd: SignUpCmd): Promise<SentEmailDto> {
    return this.http.post<SentEmailDto>(`${this.BASE_URL}/signup`, cmd).toPromise();
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
    return `Bearer ${this.getToken().accessToken}`;
  }

  getToken(): TokenLocal {
    if (sessionStorage.getItem(this.accessToken)) {
      return JSON.parse(sessionStorage.getItem(this.accessToken));
    }
    return JSON.parse(localStorage.getItem(this.accessToken));
  }

  saveToken(token: TokenDto, isSession?: boolean): void {
    const tempToken: TokenLocal = {...token, savedAt: Date.now()};
    if (isSession) {
      sessionStorage.setItem(this.accessToken, JSON.stringify(tempToken));
      return;
    }
    localStorage.setItem(this.accessToken, JSON.stringify(tempToken));
  }

  renewToken(): Promise<TokenDto> {
    const token = this.getToken().accessToken;
    return this.http.get<TokenDto>(`${this.BASE_URL}/renew/${token}`).toPromise();
  }
}