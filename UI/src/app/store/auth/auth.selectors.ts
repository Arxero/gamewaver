import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';


export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectProfile = createSelector(
  selectAuthState,
  authState => authState.profile
);

export const userProfile = createSelector(
  selectAuthState,
  user => user
);

export const authenticated = createSelector(
  selectAuthState,
  isAuthorized => isAuthorized.isAuthenticated
);
