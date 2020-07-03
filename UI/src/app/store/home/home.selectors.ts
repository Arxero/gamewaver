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

export const usersInPosts = createSelector(
  selectHomeState,
  homeState => homeState.usersInPosts
);

export const userInPost = createSelector(
  selectHomeState,
  homeState => homeState.userInPost
);

export const homeStatePost = createSelector(
  selectHomeState,
  homeState => homeState.post
);