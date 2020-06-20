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
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { MatDialog } from '@angular/material/dialog';
import { RegisterConfirmDialogComponent } from '../../auth/register/register-confirm-dialog';
import { loginFullRoute } from '../../auth/auth.routing';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authservice: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store<AuthState>,
    private dialog: MatDialog,
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
      this.snackBar.open('Registration successfull', 'CLOSE', {
        duration: 5000,
      });
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
      } catch (error) {
        console.log(error);
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
    map(() => {}),
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
        const response = await this.authservice.getUser();
        this.store.dispatch(
          new GetUserInfoSuccessAction({ userProfile: response.result }),
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
      this.snackBar.open(`${a.payload.result.message}`, 'CLOSE', {
        duration: 2000,
      });
    }),
  );

  @Effect({ dispatch: false })
  forgotPasswordFailure$ = this.actions$.pipe(
    ofType<ForgotPasswordActionFailure>(
      AuthActionTypes.ForgotPasswordActionFailure,
    ),
    tap(a => {
      this.snackBar.open(`${a.payload.error.message}`, 'CLOSE', {
        duration: 2000,
      });
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
      this.snackBar.open(`${a.payload.result}`, 'CLOSE', {
        duration: 3000,
      });
      this.router.navigate([loginFullRoute()]);
    }),
  );

  @Effect({ dispatch: false })
  resetPasswordFailure$ = this.actions$.pipe(
    ofType<ResetPasswordActionFailure>(
      AuthActionTypes.ResetPasswordActionFailure,
    ),
    tap(a => {
      this.snackBar.open(`${a.payload.error.message}`, 'CLOSE', {
        duration: 2000,
      });
    }),
  );
}
