import { Action } from '@ngrx/store';
import { User } from '../../users/models/dto/user';
import { SignUpCmd } from '../../auth/models/cmd/sign-up.cmd';
import { LoginCmd } from '../../auth/models/cmd/login.cmd';
import { TokenDto } from '../../auth/models/dto/token.dto';
import { SentEmailDto } from '../../auth/models/dto/sent-email.dto';
import { ForgotPasswordCmd } from '../../auth/models/cmd/forgot-password.cmd';
import { ResponseError } from '../../shared/models/response';
import { ResetPasswordCmd } from '../../auth/models/cmd/reset-password.cmd';

export enum AuthActionTypes {
  RegisterAction = '[Register] Action',
  RegisterActionSuccess = '[RegisterSuccess] Action',
  RegisterActionFailure = '[RegisterFailure] Action',

  LoginAction = '[Login] Action',
  LoginActionSuccess = '[LoginSuccess] Action',
  LoginActionFailure = '[LoginFailure] Action',
  LogoutAction = '[Logout] Action',

  GetUserInfoAction = '[GetUserInfo] Action',
  GetUserInfoActionSuccess = '[GetUserInfoSuccess] Action',
  GetUserInfoActionFailure = '[GetUserInfoError] Action',

  ForgotPasswordAction = '[ForgotPassword] Action',
  ForgotPasswordActionSuccess = '[ForgotPasswordSuccess] Action',
  ForgotPasswordActionFailure = '[ForgotPasswordFailure] Action',

  ResetPasswordAction = '[ResetPassword] Action',
  ResetPasswordActionSuccess = '[ResetPasswordSuccess] Action',
  ResetPasswordActionFailure = '[ResetPasswordFailure] Action',
}

export class RegisterAction implements Action {
  readonly type = AuthActionTypes.RegisterAction;
  constructor(public payload: { signUpCmd: SignUpCmd }) {}
}

export class RegisterActionSuccess implements Action {
  readonly type = AuthActionTypes.RegisterActionSuccess;
  constructor(public payload: { sentEmailDto: SentEmailDto }) {}
}

export class RegisterActionFailure implements Action {
  readonly type = AuthActionTypes.RegisterActionFailure;
}

export class LoginAction implements Action {
  readonly type = AuthActionTypes.LoginAction;
  constructor(public payload: { loginCmd: LoginCmd }) {}
}

export class LoginActionSuccess implements Action {
  readonly type = AuthActionTypes.LoginActionSuccess;
  constructor(public payload: { accessToken: TokenDto }) {}
}

export class LoginActionFailure implements Action {
  readonly type = AuthActionTypes.LoginActionFailure;
  constructor(public payload: { error: ResponseError }) {}
}

export class LogoutAction implements Action {
  readonly type = AuthActionTypes.LogoutAction;
}

export class GetUserInfoAction implements Action {
  readonly type = AuthActionTypes.GetUserInfoAction;
}

export class GetUserInfoSuccessAction implements Action {
  readonly type = AuthActionTypes.GetUserInfoActionSuccess;
  constructor(public payload: { userProfile: User }) {}
}

export class GetUserInfoErrorAction implements Action {
  readonly type = AuthActionTypes.GetUserInfoActionFailure;
}

export class ForgotPasswordAction implements Action {
  readonly type = AuthActionTypes.ForgotPasswordAction;
  constructor(public payload: { forgotPasswordCmd: ForgotPasswordCmd }) {}
}

export class ForgotPasswordActionSuccess implements Action {
  readonly type = AuthActionTypes.ForgotPasswordActionSuccess;
  constructor(public payload: { result: SentEmailDto }) {}
}

export class ForgotPasswordActionFailure implements Action {
  readonly type = AuthActionTypes.ForgotPasswordActionFailure;
  constructor(public payload: { error: ResponseError }) {}
}

export class ResetPasswordAction implements Action {
  readonly type = AuthActionTypes.ResetPasswordAction;
  constructor(public payload: { resetPasswordCmd: ResetPasswordCmd }) {}
}

export class ResetPasswordActionSuccess implements Action {
  readonly type = AuthActionTypes.ResetPasswordActionSuccess;
  constructor(public payload: { result: string }) {}
}

export class ResetPasswordActionFailure implements Action {
  readonly type = AuthActionTypes.ResetPasswordActionFailure;
  constructor(public payload: { error: ResponseError }) {}
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
  | GetUserInfoErrorAction
  | ForgotPasswordAction
  | ForgotPasswordActionSuccess
  | ForgotPasswordActionFailure
  | ResetPasswordAction
  | ResetPasswordActionSuccess
  | ResetPasswordActionFailure;
