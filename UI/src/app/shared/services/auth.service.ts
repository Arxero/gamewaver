import { Injectable } from '@angular/core';
import { Profile } from '../models/Profile';
import { EnvironmentService } from './environment.service';
import { SignUpCmd } from 'src/app/auth/models/cmd/sign-up.cmd';
import { LoginCmd } from 'src/app/auth/models/cmd/login.cmd';
import { TokenDto } from 'src/app/auth/models/dto/token.dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface IAuthService {
  login(cmd: LoginCmd): Promise<TokenDto>;
  register(cmd: SignUpCmd): Promise<TokenDto>;
  getUser(): Promise<Profile>;
  isLoggedIn(): boolean;
  logout(): void;
  getAuthorizationHeaderValue(): string;
  getAccessToken(): string;
  saveToken(token: string, isSession: boolean): void;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements IAuthService {
  BASE_URL = 'auth';
  accessToken = 'accessToken';

  constructor(
    // @Inject('HttpClientService') private httpClient: HttpClientService,
    private http: HttpClient,
    private environmentService: EnvironmentService,
  ) {}

  login(cmd: LoginCmd): Promise<TokenDto> {
    return this.http.post<TokenDto>(`${this.BASE_URL}/login`, cmd).toPromise();
  }

  register(cmd: SignUpCmd): Promise<TokenDto> {
    return this.http.post<TokenDto>(`${this.environmentService.apiUrl}${this.BASE_URL}/signup`, cmd).toPromise();
  }

  getUser(): Promise<Profile> {
    const token = this.getAuthorizationHeaderValue();
    const headers = new HttpHeaders();
    headers.append('Authorization', token);
    return this.http
      .get<Profile>(`${this.BASE_URL}/profile`, { headers })
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
    return `Bearer ${this.getAccessToken()}`;
  }

  getAccessToken(): string {
    return (
      sessionStorage.getItem(this.accessToken) ||
      localStorage.getItem(this.accessToken)
    );
  }

  saveToken(token: string, isSession?: boolean): void {
    if (isSession) {
      sessionStorage.setItem(this.accessToken, token);
      return;
    }
    localStorage.setItem(this.accessToken, token);
  }
}
