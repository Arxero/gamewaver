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

export const homeStatePost = createSelector(
  selectHomeState,
  homeState => homeState.post
);

export const homeStateisEditSuccessful = createSelector(
  selectHomeState,
  homeState => homeState.isEditSuccessful
);

export const homeStatePostComments = createSelector(
  selectHomeState,
  homeState => homeState.comments
);

export const homeStateisEditCommentSuccessful = createSelector(
  selectHomeState,
  homeState => homeState.isEditCommentSuccessful
);
