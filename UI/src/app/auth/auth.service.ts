import { SignUpCmd, LoginCmd } from './auth.models';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';
import { AuthApiService } from '../services/auth.api.service';
import { LoadingService } from '../services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../users/users.service';
import { Router } from '@angular/router';
import { UserViewModel } from '../users/user-view-models';
import { EnvironmentService } from '../services/environment.service';
import { BaseService } from '../shared/models/base.service';
import { SnackbarErrors } from '../shared/models/common';

@Injectable()
export class AuthService extends BaseService<SignUpCmd> {
  private _profileSubject = new BehaviorSubject<UserViewModel>(null);
  private _profile: UserViewModel;

  isAuthenticated: boolean;

  get profile$(): Observable<UserViewModel> {
    return this._profileSubject.asObservable();
  }

  constructor(
    private authApiService: AuthApiService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private usersService: UsersService,
    private router: Router,
    snackbarService: SnackbarService,
    environmentService: EnvironmentService
  ) {
    super(environmentService, snackbarService)
  }

  async login(cmd: LoginCmd): Promise<void> {
    try {
      this.loadingService.setUILoading();
      const accessToken = await this.authApiService.login(cmd);
      this.authApiService.saveToken(accessToken);
      await this.getProfile();
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.Login);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  async getProfile(): Promise<void> {
    try {
      const profile = (await this.authApiService.getUser()).result;
      this._profile = this.usersService.mapUser(profile);
      this._profileSubject.next(this._profile);
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.GetUser);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  logout(): void {
    this.authApiService.logout();
    this._profile = null;
    this._profileSubject.next(null);
  }
}
