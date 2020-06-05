import { Action } from '@ngrx/store';
import { Profile } from 'src/app/shared/models/Profile';

export enum AuthActionTypes {
  LoginAction = '[Login] Action',
  LoginActionSuccess = '[LoginSuccess] Action',
  LoginActionFailure = '[LoginFailure] Action',

  LoginWaitAction = '[LoginWait] Action',
  LoginCallBackAction = '[LoginCallBack] Action',
  LogoutAction = '[Logout] Action',
  SetLoggedInUser = '[SetLoggedInUser] Action',

  GetUserInfo = '[GetUserInfo] Action',
  GetUserInfoSuccess = '[GetUserInfoSuccess] Action',
  GetUserInfoError = '[GetUserInfoError] Action',
}

export class LoginAction implements Action {
  readonly type = AuthActionTypes.LoginAction;
}

export class LoginActionSuccess implements Action {
  readonly type = AuthActionTypes.LoginActionSuccess;
  constructor(public payload: { user: Profile, isAuthenticated: boolean }) { }
}

export class LoginActionFailure implements Action {
  readonly type = AuthActionTypes.LoginActionFailure;
  constructor(public payload: { isAuthenticated: boolean }) { }
}

export class LogoutAction implements Action {
  readonly type = AuthActionTypes.LogoutAction;
}

export class SetLoggedInUserAction implements Action {
  readonly type = AuthActionTypes.SetLoggedInUser;
  constructor(public payload: { user: Profile, isAuthenticated: boolean }) { }
}

export class GetUserInfoAction implements Action {
  readonly type = AuthActionTypes.GetUserInfo;
}

export class GetUserInfoSuccessAction implements Action {
  readonly type = AuthActionTypes.GetUserInfoSuccess;
  constructor(public payload: { userProfile: Profile }) { }
}

export class GetUserInfoErrorAction implements Action {
  readonly type = AuthActionTypes.GetUserInfoError;
}

export type AuthActions = LoginAction
  | LoginActionSuccess
  | LoginActionFailure
  | LogoutAction
  | SetLoggedInUserAction
  | GetUserInfoAction
  | GetUserInfoSuccessAction
  | GetUserInfoErrorAction;