import { createSelector, createFeatureSelector } from '@ngrx/store';
import { HomeState } from './home.reducer';


export const selectHomeState = createFeatureSelector<HomeState>('home');

export const homeState = createSelector(
  selectHomeState,
  homeState => homeState
);

export const homeStatePosts = createSelector(
  selectHomeState,
  homeState => homeState.posts,
);

export const homeStateVotedPosts = createSelector(
  selectHomeState,
  homeState => homeState.votedPosts,
);

export const homeStatePost = createSelector(
  selectHomeState,
  homeState => homeState.post
);

export const homeStateisEditSuccessful = createSelector(
  selectHomeState,
  homeState => homeState.isEditSuccessful
);

export const homeStateSidebarNavigation = createSelector(
  selectHomeState,
  homeState => homeState.sidebarNavigation
);

export const homeScrollPosition = createSelector(
  selectHomeState,
  homeState => homeState.scrollPosition
);

