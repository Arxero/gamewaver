import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';

export const reducers: ActionReducerMap<any> = {};
export const metaReducers: MetaReducer<any>[] = !environment.production ? [storeFreeze] : [];
