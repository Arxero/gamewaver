import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';
import { authReducer, AuthState } from './auth/auth.reducer';
import { usersReducer, UsersState } from './users/users.reducer';
import { HomeState, homeReducer } from './home/home.reducer';

export interface AppState {
  auth: AuthState;
  users: UsersState;
  home: HomeState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  users: usersReducer,
  home: homeReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [storeFreeze]
  : [];
