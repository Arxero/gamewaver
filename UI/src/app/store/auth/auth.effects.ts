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
} from './auth.actions';
import { tap, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authservice: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store<AuthState>,
  ) {}

  @Effect({ dispatch: false })
  register$ = this.actions$.pipe(
    ofType<RegisterAction>(AuthActionTypes.RegisterAction),
    tap(async a => {
      try {
        const accessToken = await this.authservice.register(a.payload.signUpCmd);
        this.store.dispatch(new RegisterActionSuccess({ accessToken }));
      } catch (error) {
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  registerSuccess$ = this.actions$.pipe(
    ofType<RegisterActionSuccess>(AuthActionTypes.RegisterActionSuccess),
    tap(a => {
      this.authservice.saveToken(a.payload.accessToken);
      this.router.navigate(['/']);
      this.snackBar.open('Registration successfull', 'CLOSE', {
        duration: 2000,
      });
      this.store.dispatch(new GetUserInfoAction());
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
    ofType<GetUserInfoAction>(AuthActionTypes.GetUserInfo),
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
    ofType<GetUserInfoSuccessAction>(AuthActionTypes.GetUserInfoSuccess),
    tap(() => {}),
  );

  @Effect({ dispatch: false })
  getUserInfoError$ = this.actions$.pipe(
    ofType<GetUserInfoErrorAction>(AuthActionTypes.GetUserInfoError),
    tap(() => {}),
  );
}
