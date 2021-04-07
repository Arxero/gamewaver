import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';
import { authReducer, AuthState } from './auth/auth.reducer';
import { HomeState, homeReducer } from './home/home.reducer';

export interface AppState {
  auth: AuthState;
  home: HomeState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  home: homeReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [storeFreeze]
  : [];
