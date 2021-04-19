import { CreatePostCmd, UpdatePostCmd, CreatePostVoteCmd, GetVoteDto } from './../../home/models/home.models';
import {
  SidebarNavigation,
} from '../../sidebar/sidebar-view.models';
import { Sorting, PagedData } from './../../shared/models/common';
import { Action } from '@ngrx/store';
import { Paging, DataFilter } from '../../shared/models/common';
import {
  UserActionOnPost,
  PostContext,
  PostViewModel,
} from '../../home/models/home-view-model';

export enum HomeActionTypes {
  // POSTS
  CreatePostAction = '[CreatePost] Action',
  CreatePostActionSuccess = '[CreatePostSuccess] Action',

  EditPostAction = '[EditPost] Action',
  EditPostActionSuccess = '[EditPostSuccess] Action',

  GetPostsAction = '[GetPostsPost] Action',
  GetPostsActionSuccess = '[GetPostsSuccess] Action',
  ClearPostsAction = '[ClearPosts] Action',
  ClearPostAction = '[ClearPost] Action',

  GetPostAction = '[GetPost] Action',
  GetPostActionSuccess = '[GetPostSuccess] Action',
  SetPostPagePost = '[SetPostPagePost] Action',

  DeletePostAction = '[DeletePost] Action',
  DeletePostActionSuccess = '[DeletePostSuccess] Action',

  SidebarNavigationAction = '[SidebarNavigation] Action',

  // VOTES
  CreatePostUpvoteAction = '[CreatePostUpvote] Action',
  CreatePostUpvoteActionSuccess = '[CreatePostUpvoteSuccess] Action',

  DeletePostUpvoteAction = '[DeletePostUpvote] Action',
  DeletePostUpvoteActionSuccess = '[DeletePostUpvoteSuccess] Action',

  SaveScrollPositionAction = '[SaveScrollPosition] Action',
}

// CREATE POST
export class CreatePostAction implements Action {
  readonly type = HomeActionTypes.CreatePostAction;
  constructor(public payload: { cmd: CreatePostCmd }) {}
}

export class CreatePostActionSuccess implements Action {
  readonly type = HomeActionTypes.CreatePostActionSuccess;
  constructor(public payload: { data: PostViewModel }) {}
}

// EDIT POST
export class EditPostAction implements Action {
  readonly type = HomeActionTypes.EditPostAction;
  constructor(public payload: { cmd: UpdatePostCmd; id: string }) {}
}

export class EditPostActionSuccess implements Action {
  readonly type = HomeActionTypes.EditPostActionSuccess;
  constructor(public payload: { id: string }) {}
}

// GET POSTS
export class GetPostsAction implements Action {
  readonly type = HomeActionTypes.GetPostsAction;
  constructor(
    public payload: {
      paging: Paging;
      filters?: DataFilter[];
      userActionOnPost?: UserActionOnPost;
      sorting?: Sorting[];
    },
  ) {}
}

export class GetPostsActionSuccess implements Action {
  readonly type = HomeActionTypes.GetPostsActionSuccess;
  constructor(public payload: { data: PagedData<PostViewModel> }) {}
}

export class ClearPostsAction implements Action {
  readonly type = HomeActionTypes.ClearPostsAction;
}

export class ClearPostAction implements Action {
  readonly type = HomeActionTypes.ClearPostAction;
}

// GET POST
export class GetPostAction implements Action {
  readonly type = HomeActionTypes.GetPostAction;
  constructor(public payload: { id: string }) {}
}

export class GetPostActionSuccess implements Action {
  readonly type = HomeActionTypes.GetPostActionSuccess;
  constructor(public payload: { data: PostViewModel }) {}
}

export class SetPostPagePost implements Action {
  readonly type = HomeActionTypes.SetPostPagePost;
  constructor(public payload: { data: PostViewModel }) {}
}

// DELETE POST
export class DeletePostAction implements Action {
  readonly type = HomeActionTypes.DeletePostAction;
  constructor(public payload: { id: string; postContext?: PostContext }) {}
}

export class DeletePostActionSuccess implements Action {
  readonly type = HomeActionTypes.DeletePostActionSuccess;
  constructor(public payload: { id: string; postContext?: PostContext }) {}
}

export class SidebarNavigationAction implements Action {
  readonly type = HomeActionTypes.SidebarNavigationAction;
  constructor(public payload: { sidebarNavigation: SidebarNavigation }) {}
}

// CREATE POSTVOTE
export class CreatePostUpvoteAction implements Action {
  readonly type = HomeActionTypes.CreatePostUpvoteAction;
  constructor(public payload: { cmd: CreatePostVoteCmd }) {}
}

export class CreatePostUpvoteActionSuccess implements Action {
  readonly type = HomeActionTypes.CreatePostUpvoteActionSuccess;
  constructor(public payload: { data: GetVoteDto }) {}
}

// DELETE POSTVOTE
export class DeletePostUpvoteAction implements Action {
  readonly type = HomeActionTypes.DeletePostUpvoteAction;
  constructor(public payload: { id: string }) {}
}

export class DeletePostUpvoteActionSuccess implements Action {
  readonly type = HomeActionTypes.DeletePostUpvoteActionSuccess;
  constructor(public payload: { data: GetVoteDto }) {}
}

export class SaveScrollPositionAction implements Action {
  readonly type = HomeActionTypes.SaveScrollPositionAction;
  constructor(public payload: { data: [number, number] }) {}
}

export type HomeActions =
  | CreatePostAction
  | CreatePostActionSuccess
  | EditPostAction
  | EditPostActionSuccess
  | GetPostsAction
  | GetPostsActionSuccess
  | SidebarNavigationAction
  | ClearPostsAction
  | ClearPostAction
  | DeletePostAction
  | DeletePostActionSuccess
  | GetPostAction
  | GetPostActionSuccess
  | SetPostPagePost
  | CreatePostUpvoteAction
  | CreatePostUpvoteActionSuccess
  | DeletePostUpvoteAction
  | DeletePostUpvoteActionSuccess
  | SaveScrollPositionAction;
