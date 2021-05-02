import { loginFullRoute } from './../../auth/auth.models';
import { UsersService } from './../../users/users.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  LoginActionSuccess,
  AuthActionTypes,
  LoginAction,
  LoginActionFailure,
  LogoutAction,
  GetUserInfoAction,
  GetUserInfoSuccessAction,
  GetUserInfoErrorAction,
  RegisterAction,
  RegisterActionSuccess,
  RegisterActionFailure,
  ForgotPasswordAction,
  ForgotPasswordActionSuccess,
  ForgotPasswordActionFailure,
  ResetPasswordAction,
  ResetPasswordActionSuccess,
  ResetPasswordActionFailure,
} from './auth.actions';
import { tap, map, switchMap } from 'rxjs/operators';
import { AuthApiService } from '../../services/auth.api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { MatDialog } from '@angular/material/dialog';
import { RegisterConfirmDialogComponent } from '../../auth/register-confirm-dialog';
import { SnackbarService } from '../../services/snackbar.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authservice: AuthApiService,
    private router: Router,
    private snackbarService: SnackbarService,
    private store: Store<AuthState>,
    private dialog: MatDialog,
    private usersService: UsersService
  ) {}

  @Effect({ dispatch: false })
  register$ = this.actions$.pipe(
    ofType<RegisterAction>(AuthActionTypes.RegisterAction),
    tap(async a => {
      try {
        const sentEmailDto = await this.authservice.register(
          a.payload.signUpCmd,
        );
        this.store.dispatch(new RegisterActionSuccess({ sentEmailDto }));
      } catch (error) {
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  registerSuccess$ = this.actions$.pipe(
    ofType<RegisterActionSuccess>(AuthActionTypes.RegisterActionSuccess),
    tap(a => {
      this.router.navigate(['/']);
      this.dialog.open(RegisterConfirmDialogComponent, {
        data: a.payload.sentEmailDto,
      });
      this.snackbarService.showInfo('Registration Successfull');
    }),
  );

  @Effect({ dispatch: false })
  registerFailure$ = this.actions$.pipe(
    ofType<RegisterActionFailure>(AuthActionTypes.RegisterActionFailure),
    map(() => {}),
  );

  @Effect({ dispatch: false })
  login$ = this.actions$.pipe(
    ofType<LoginAction>(AuthActionTypes.LoginAction),
    tap(async a => {
      try {
        const accessToken = await this.authservice.login(a.payload.loginCmd);
        this.store.dispatch(new LoginActionSuccess({ accessToken }));
      } catch ({ error }) {
        this.store.dispatch(new LoginActionFailure({ error }));
      }
    }),
  );

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$.pipe(
    ofType<LoginActionSuccess>(AuthActionTypes.LoginActionSuccess),
    tap(a => {
      this.authservice.saveToken(a.payload.accessToken);
      this.store.dispatch(new GetUserInfoAction());
      this.router.navigate(['/']);
    }),
  );

  @Effect({ dispatch: false })
  loginFailure$ = this.actions$.pipe(
    ofType<LoginActionFailure>(AuthActionTypes.LoginActionFailure),
    map(a => {
      this.snackbarService.showWarn(a.payload.error.message);
    }),
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType<LogoutAction>(AuthActionTypes.LogoutAction),
    tap(() => {
      this.authservice.logout();
      this.router.navigate(['/']);
    }),
  );

  // user info
  @Effect({ dispatch: false })
  getUserInfo$ = this.actions$.pipe(
    ofType<GetUserInfoAction>(AuthActionTypes.GetUserInfoAction),
    switchMap(async () => {
      try {
        const { result } = await this.authservice.getUser();
        const mappedUser = this.usersService.mapUser(result);
        this.store.dispatch(
          new GetUserInfoSuccessAction({ userProfile: mappedUser }),
        );
      } catch (error) {
        console.log(error.toString());
      }
    }),
  );

  @Effect({ dispatch: false })
  getUserInfoSuccess$ = this.actions$.pipe(
    ofType<GetUserInfoSuccessAction>(AuthActionTypes.GetUserInfoActionSuccess),
    tap(() => {}),
  );

  @Effect({ dispatch: false })
  getUserInfoError$ = this.actions$.pipe(
    ofType<GetUserInfoErrorAction>(AuthActionTypes.GetUserInfoActionFailure),
    tap(() => {}),
  );

  // forgot password
  @Effect({ dispatch: false })
  forgotPassword$ = this.actions$.pipe(
    ofType<ForgotPasswordAction>(AuthActionTypes.ForgotPasswordAction),
    tap(async a => {
      try {
        const { result } = await this.authservice.forgotPassword(
          a.payload.forgotPasswordCmd,
        );
        this.store.dispatch(new ForgotPasswordActionSuccess({ result }));
      } catch ({ error }) {
        this.store.dispatch(new ForgotPasswordActionFailure({ error }));
      }
    }),
  );

  @Effect({ dispatch: false })
  forgotPasswordSuccess$ = this.actions$.pipe(
    ofType<ForgotPasswordActionSuccess>(
      AuthActionTypes.ForgotPasswordActionSuccess,
    ),
    tap(a => {
      this.snackbarService.showInfo(a.payload.result.message);
    }),
  );

  @Effect({ dispatch: false })
  forgotPasswordFailure$ = this.actions$.pipe(
    ofType<ForgotPasswordActionFailure>(
      AuthActionTypes.ForgotPasswordActionFailure,
    ),
    tap(a => {
      this.snackbarService.showInfo(a.payload.error.message);
    }),
  );

  // reset password
  @Effect({ dispatch: false })
  resetPassword$ = this.actions$.pipe(
    ofType<ResetPasswordAction>(AuthActionTypes.ResetPasswordAction),
    tap(async a => {
      try {
        const { result } = await this.authservice.resetPassword(
          a.payload.resetPasswordCmd,
        );
        this.store.dispatch(new ResetPasswordActionSuccess({ result }));
      } catch ({ error }) {
        this.store.dispatch(new ResetPasswordActionFailure({ error }));
      }
    }),
  );

  @Effect({ dispatch: false })
  resetPasswordSuccess$ = this.actions$.pipe(
    ofType<ResetPasswordActionSuccess>(
      AuthActionTypes.ResetPasswordActionSuccess,
    ),
    tap(a => {
      this.snackbarService.showInfo(a.payload.result);
      this.router.navigate([loginFullRoute()]);
    }),
  );

  @Effect({ dispatch: false })
  resetPasswordFailure$ = this.actions$.pipe(
    ofType<ResetPasswordActionFailure>(
      AuthActionTypes.ResetPasswordActionFailure,
    ),
    tap(a => {
      this.snackbarService.showInfo(a.payload.error.message);
    }),
  );
}
