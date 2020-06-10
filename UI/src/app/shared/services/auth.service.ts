import { Injectable } from '@angular/core';
import { Profile } from '../models/Profile';
import { EnvironmentService } from './environment.service';
import { SignUpCmd } from '../../auth/models/cmd/sign-up.cmd';
import { LoginCmd } from '../../auth/models/cmd/login.cmd';
import { TokenDto } from '../../auth/models/dto/token.dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResponse } from '../models/response';

export interface IAuthService {
  login(cmd: LoginCmd): Promise<TokenDto>;
  register(cmd: SignUpCmd): Promise<TokenDto>;
  getUser(): Promise<IResponse<Profile>>;
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

  register(cmd: SignUpCmd): Promise<TokenDto> {
    return this.http.post<TokenDto>(`${this.BASE_URL}/signup`, cmd).toPromise();
  }

  getUser(): Promise<IResponse<Profile>> {
    const token = this.getAuthorizationHeaderValue();
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', token);
    return this.http
      .get<IResponse<Profile>>(`${this.BASE_URL}/profile`, { headers })
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
