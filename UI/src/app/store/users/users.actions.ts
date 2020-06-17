import { Action } from '@ngrx/store';
import { UpdateUserCmd } from '../../users/models/cmd/update-user.cmd';
import { User } from '../../users/models/dto/user';

export enum UsersActionTypes {
  EditUserAction = '[EditUser] Action',
  EditUserActionSuccess = '[EditUserSuccess] Action',
  EditUserActionFailure = '[EditUserFailure] Action',
}


export class EditUserAction implements Action {
  readonly type = UsersActionTypes.EditUserAction;
  constructor(public payload: { updateUserCmd: UpdateUserCmd }) {}
}

export class EditUserActionSuccess implements Action {
  readonly type = UsersActionTypes.EditUserActionSuccess;
  constructor(public payload: { user: User }) {}
}

export class EditUserActionFailure implements Action {
  readonly type = UsersActionTypes.EditUserActionFailure;
}

export type UsersActions =
  | EditUserAction
  | EditUserActionSuccess
  | EditUserActionFailure;

