import { Action } from '@ngrx/store';
import { Profile } from '../../shared/models/Profile';
import { SignUpCmd } from '../../auth/models/cmd/sign-up.cmd';
import { LoginCmd } from '../../auth/models/cmd/login.cmd';
import { TokenDto, TokenLocal } from 'src/app/auth/models/dto/token.dto';

export enum AuthActionTypes {
  RegisterAction = '[Register] Action',
  RegisterActionSuccess = '[RegisterSuccess] Action',
  RegisterActionFailure = '[RegisterFailure] Action',

  LoginAction = '[Login] Action',
  LoginActionSuccess = '[LoginSuccess] Action',
  LoginActionFailure = '[LoginFailure] Action',
  LogoutAction = '[Logout] Action',

  GetUserInfo = '[GetUserInfo] Action',
  GetUserInfoSuccess = '[GetUserInfoSuccess] Action',
  GetUserInfoError = '[GetUserInfoError] Action',
}

export class RegisterAction implements Action {
  readonly type = AuthActionTypes.RegisterAction;
  constructor(public payload: { signUpCmd: SignUpCmd }) {}
}

export class RegisterActionSuccess implements Action {
  readonly type = AuthActionTypes.RegisterActionSuccess;
  constructor(public payload: { accessToken: TokenLocal }) {}
}

export class RegisterActionFailure implements Action {
  readonly type = AuthActionTypes.LoginActionFailure;
  constructor(public payload: { isAuthenticated: boolean }) {}
}

export class LoginAction implements Action {
  readonly type = AuthActionTypes.LoginAction;
  constructor(public payload: { loginCmd: LoginCmd }) {}
}

export class LoginActionSuccess implements Action {
  readonly type = AuthActionTypes.LoginActionSuccess;
  constructor(public payload: { accessToken: TokenLocal }) {}
}

export class LoginActionFailure implements Action {
  readonly type = AuthActionTypes.LoginActionFailure;
  constructor(public payload: { isAuthenticated: boolean }) {}
}

export class LogoutAction implements Action {
  readonly type = AuthActionTypes.LogoutAction;
}

export class GetUserInfoAction implements Action {
  readonly type = AuthActionTypes.GetUserInfo;
}

export class GetUserInfoSuccessAction implements Action {
  readonly type = AuthActionTypes.GetUserInfoSuccess;
  constructor(public payload: { userProfile: Profile }) {}
}

export class GetUserInfoErrorAction implements Action {
  readonly type = AuthActionTypes.GetUserInfoError;
}

export type AuthActions =
  | RegisterAction
  | RegisterActionSuccess
  | RegisterActionFailure
  | RegisterAction
  | LoginAction
  | LoginActionSuccess
  | LoginActionFailure
  | LogoutAction
  | GetUserInfoAction
  | GetUserInfoSuccessAction
  | GetUserInfoErrorAction;
