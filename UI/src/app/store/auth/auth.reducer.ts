import { AuthActions, AuthActionTypes } from './auth.actions';
import { User } from '../../users/models/dto/user';

export interface AuthState {
  profile: User;
  isAuthenticated: boolean;
}

export const initialAuthState: AuthState = {
  profile: null,
  isAuthenticated: false,
} as AuthState;

export function authReducer(
  state = initialAuthState,
  action: AuthActions,
): AuthState {
  switch (action.type) {
    case AuthActionTypes.LoginActionSuccess:
      return {
        ...state,
        isAuthenticated: true,
      } as AuthState;

    case AuthActionTypes.GetUserInfoActionSuccess:
      return {
        ...state,
        isAuthenticated: true,
        profile: action.payload.userProfile,
      } as AuthState;

    case AuthActionTypes.LogoutAction:
      return {
        ...state,
        isAuthenticated: initialAuthState.isAuthenticated,
        profile: initialAuthState.profile,
      } as AuthState;

    default:
      return state;
  }
}
