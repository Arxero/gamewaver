import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UsersState } from './users.reducer';


export const selectUsersState = createFeatureSelector<UsersState>('users');

export const usersState = createSelector(
  selectUsersState,
  usersState => usersState
);

export const usersStateProfileUser = createSelector(
  selectUsersState,
  usersState => usersState.profileUser
);

