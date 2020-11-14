import { CommentsState, commentsReducer } from './comments/comments.reducer';
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
  comments: CommentsState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  users: usersReducer,
  home: homeReducer,
  comments: commentsReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [storeFreeze]
  : [];
