import { AuthActions, AuthActionTypes } from './auth.actions';
import { Profile } from 'src/app/shared/models/Profile';

export interface AuthState {
  profile: Profile;
  isAuthenticated: boolean;
}

export const initialAuthState: AuthState = {
  profile: null,
  isAuthenticated: false,
  user: null
} as AuthState;

export function authReducer(
  state = initialAuthState,
  action: AuthActions): AuthState {
  switch (action.type) {

    case AuthActionTypes.LoginAction:
      return {
        ...state
      } as AuthState;

    case AuthActionTypes.LoginActionSuccess:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated
      } as AuthState;

    case AuthActionTypes.LoginActionFailure:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated
      } as AuthState;

    case AuthActionTypes.SetLoggedInUser:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated
      } as AuthState;

    case AuthActionTypes.GetUserInfoSuccess:
      return {
        ...state,
        profile: action.payload.userProfile
      } as AuthState;


    default:
      return state;
  }
}
