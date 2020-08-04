import { User } from '../../users/models/dto/user';
import { UsersActionTypes, UsersActions } from './users.actions';
import { UserViewModel } from '../../users/models/view/user-view-model';

export interface UsersState {
  users: User[];
  profileUser: UserViewModel;
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

    case UsersActionTypes.ClearProfileUserAction:
      return {
        ...state,
        profileUser: null,
      } as UsersState;

    default:
      return state;
  }
}
