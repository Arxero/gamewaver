import { Action } from '@ngrx/store';
import { User, UpdateUserCmd } from '../../users/user';
import { UserViewModel } from '../../users/user-view-models';

export enum UsersActionTypes {
  EditUserAction = '[EditUser] Action',
  EditUserActionSuccess = '[EditUserSuccess] Action',
  EditUserActionFailure = '[EditUserFailure] Action',

  GetUserAction = '[GetUser] Action',
  GetUserActionSuccess = '[GetUserSuccess] Action',
  GetUserActionFailure = '[GetUserFailure] Action',

  ClearProfileUserAction = '[ClearProfileUser] Action'
}

// EDIT USER
export class EditUserAction implements Action {
  readonly type = UsersActionTypes.EditUserAction;
  constructor(public payload: { id: string; updateUserCmd: UpdateUserCmd }) {}
}

export class EditUserActionSuccess implements Action {
  readonly type = UsersActionTypes.EditUserActionSuccess;
  constructor(public payload: { user: User }) {}
}

export class EditUserActionFailure implements Action {
  readonly type = UsersActionTypes.EditUserActionFailure;
}

// GET USER
export class GetUserAction implements Action {
  readonly type = UsersActionTypes.GetUserAction;
  constructor(public payload: { id: string }) {}
}

export class GetUserActionSuccess implements Action {
  readonly type = UsersActionTypes.GetUserActionSuccess;
  constructor(public payload: { user: UserViewModel }) {}
}

export class GetUserActionFailure implements Action {
  readonly type = UsersActionTypes.GetUserActionFailure;
}

export class ClearProfileUserAction implements Action {
  readonly type = UsersActionTypes.ClearProfileUserAction;
}

export type UsersActions =
  | EditUserAction
  | EditUserActionSuccess
  | EditUserActionFailure
  | GetUserAction
  | GetUserActionSuccess
  | GetUserActionFailure
  | ClearProfileUserAction;

