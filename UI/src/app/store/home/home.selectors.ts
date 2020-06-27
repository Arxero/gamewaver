import { createSelector, createFeatureSelector } from '@ngrx/store';
import { HomeState } from './home.reducer';


export const selectHomeState = createFeatureSelector<HomeState>('home');

export const homeState = createSelector(
  selectHomeState,
  homeState => homeState
);

export const homeStatePosts = createSelector(
  selectHomeState,
  homeState => homeState.posts
);


