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
} from './auth.actions';
import { tap, map, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
  ) {}

  @Effect({ dispatch: false })
  login$ = this.actions$.pipe(
    ofType<LoginAction>(AuthActionTypes.LoginAction),
    tap(async () => {}),
  );

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$.pipe(
    ofType<LoginActionSuccess>(AuthActionTypes.LoginActionSuccess),
    map(() => {}),
  );

  @Effect({ dispatch: false })
  loginFailure$ = this.actions$.pipe(
    ofType<LoginActionFailure>(AuthActionTypes.LoginActionFailure),
    map(() => {}),
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType<LogoutAction>(AuthActionTypes.LogoutAction),
    tap(() => {}),
  );

  // user info
  @Effect({ dispatch: false })
  getUserInfo$ = this.actions$.pipe(
    ofType<GetUserInfoAction>(AuthActionTypes.GetUserInfo),
    switchMap(async () => {}),
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
