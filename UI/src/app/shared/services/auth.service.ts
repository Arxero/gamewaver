import { Injectable } from '@angular/core';
import { Profile } from '../models/Profile';
import { EnvironmentService } from './environment.service';
import { SignUpCmd } from 'src/app/auth/models/cmd/sign-up.cmd';
import { LoginCmd } from 'src/app/auth/models/cmd/login.cmd';
import { TokenDto } from 'src/app/auth/models/dto/token.dto';

export interface IAuthService {
  login(model: LoginCmd): Promise<TokenDto>;
  register(model: SignUpCmd): Promise<TokenDto>;
  getUser(): Promise<Profile>;
  isLoggedIn(): boolean;
  logout(): void;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements IAuthService {
  constructor(
    private environmentService: EnvironmentService
  ) {}


  login(model: LoginCmd): Promise<TokenDto> {
    throw new Error('Method not implemented.');
  }

  register(model: SignUpCmd): Promise<TokenDto> {
    throw new Error('Method not implemented.');
  }

  getUser(): Promise<Profile> {
    throw new Error('Method not implemented.');
  }

  isLoggedIn(): boolean {
    throw new Error('Method not implemented.');
  }

  logout(): void {
    throw new Error('Method not implemented.');
  }

}
