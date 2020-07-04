import { User } from '../../users/models/dto/user';
import { UsersActionTypes, UsersActions } from './users.actions';

export interface UsersState {
  users: User[];
  profileUser: User;
}

export const initialUsersState: UsersState = {
  users: null,
  profileUser: null,
} as UsersState;

export function usersReducer(
  state = initialUsersState,
  action: UsersActions,
): UsersState {
  switch (action.type) {
    case UsersActionTypes.EditUserAction:
      return {
        ...state,
      } as UsersState;

    case UsersActionTypes.EditUserActionSuccess:
      return {
        ...state,
      } as UsersState;

    case UsersActionTypes.GetUserActionSuccess:
      return {
        ...state,
        profileUser: action.payload.user,
      } as UsersState;

    default:
      return state;
  }
}
