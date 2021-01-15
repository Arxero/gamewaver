import { User } from '../../users/user';
import { UsersActionTypes, UsersActions } from './users.actions';
import { UserViewModel } from '../../users/user-view-models';

export interface UsersState {
  profileUser: UserViewModel;
}

export const initialUsersState: UsersState = {
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

    case UsersActionTypes.ClearProfileUserAction:
      return {
        ...state,
        profileUser: null,
      } as UsersState;

    default:
      return state;
  }
}
