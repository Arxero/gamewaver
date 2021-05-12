import { SignUpCmd, LoginCmd, ForgotPasswordCmd, ResetPasswordCmd, loginFullRoute } from './auth.models';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';
import { AuthApiService } from '../services/auth.api.service';
import { LoadingService } from '../services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserViewModel, usersProfileFullRoute } from '../users/user-view-models';
import { EnvironmentService } from '../services/environment.service';
import { BaseService } from '../shared/models/base.service';
import { SnackbarErrors } from '../shared/models/common';
import { RegisterConfirmDialogComponent } from './register-confirm-dialog';

@Injectable()
export class AuthService extends BaseService<SignUpCmd> {
  private _profileSubject = new BehaviorSubject<UserViewModel>(null);
  private _profile: UserViewModel;

  set profile(value: UserViewModel) {
    this._profile = value;
    this._profileSubject.next(this._profile);
  }

  get profile$(): Observable<UserViewModel> {
    return this._profileSubject.asObservable();
  }

  constructor(
    private authApiService: AuthApiService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private router: Router,
    snackbarService: SnackbarService,
    environmentService: EnvironmentService,
  ) {
    super(environmentService, snackbarService);
  }

  async create(cmd: SignUpCmd): Promise<void> {
    try {
      this.loadingService.setUILoading();
      const sentEmailDto = await this.authApiService.register(cmd);
      this.router.navigate(['/']);
      this.dialog.open(RegisterConfirmDialogComponent, { data: sentEmailDto });
      this.snackbarService.showInfo('Registration Successfull');
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.Register);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  async login(cmd: LoginCmd, isAfterEmailConfirm?: boolean): Promise<void> {
    try {
      this.loadingService.setUILoading();
      const accessToken = await this.authApiService.login(cmd);
      this.authApiService.saveToken(accessToken);
      await this.getProfile();

      if (isAfterEmailConfirm) {
        this.router.navigate(['/']);
      }
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.Login);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  async getProfile(): Promise<void> {
    try {
      const profile = (await this.authApiService.getUser()).result;
      this._profile = this.mapUser(profile);
      this._profileSubject.next(this._profile);
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.GetUser);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  async forgotPassword(cmd: ForgotPasswordCmd): Promise<void> {
    try {
      this.loadingService.setUILoading();
      const sentEmailDto = (await this.authApiService.forgotPassword(cmd)).result;
      this.snackbarService.showInfo(sentEmailDto.message);
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.ForgotPassword);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  async resetPassword(cmd: ResetPasswordCmd): Promise<void> {
    try {
      this.loadingService.setUILoading();
      const message = (await this.authApiService.resetPassword(cmd)).result;
      this.snackbarService.showInfo(message);
      this.router.navigate([loginFullRoute()]);
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.ResetPassword);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  logout(): void {
    this.authApiService.logout();
    this._profile = null;
    this._profileSubject.next(null);
  }

  cancelEdit(id: string) {
    this.router.navigate([usersProfileFullRoute(id)])
  }
}
