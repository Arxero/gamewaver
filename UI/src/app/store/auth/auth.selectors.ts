import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';


export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const authState = createSelector(
  selectAuthState,
  authState => authState
);

export const userProfile = createSelector(
  selectAuthState,
  user => user.profile
);

export const authenticated = createSelector(
  selectAuthState,
  isAuthenticated => isAuthenticated.isAuthenticated
);
