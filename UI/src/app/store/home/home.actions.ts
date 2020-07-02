import { CreatePostCmd } from '../../home/models/cmd/create-post.cmd';
import { Action } from '@ngrx/store';
import { PostViewModel } from '../../home/models/view/post-view-model';
import { User } from '../../users/models/dto/user';

export enum HomeActionTypes {
  CreatePostAction = '[CreatePost] Action',
  CreatePostActionSuccess = '[CreatePostSuccess] Action',
  CreatePostActionFailure = '[CreatePostFailure] Action',

  GetPostsAction = '[GetPostsPost] Action',
  GetPostsActionSuccess = '[GetPostsPostSuccess] Action',
  GetPostsActionFailure = '[GetPostsPostFailure] Action',

  DeletePostAction = '[DeletePost] Action',
  DeletePostActionSuccess = '[DeletePostSuccess] Action',
  DeletePostActionFailure = '[DeletePostFailure] Action',
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

export class CreatePostActionFailure implements Action {
  readonly type = HomeActionTypes.CreatePostActionFailure;
}

// GET POSTS
export class GetPostsAction implements Action {
  readonly type = HomeActionTypes.GetPostsAction;
}

export class GetPostsActionSuccess implements Action {
  readonly type = HomeActionTypes.GetPostsActionSuccess;
  constructor(public payload: { data: PostViewModel[], users: User[] }) {}
}

export class GetPostsActionFailure implements Action {
  readonly type = HomeActionTypes.GetPostsActionFailure;
}

// DELETE POST
export class DeletePostAction implements Action {
  readonly type = HomeActionTypes.DeletePostAction;
  constructor(public payload: { id: string }) {}
}

export class DeletePostActionSuccess implements Action {
  readonly type = HomeActionTypes.DeletePostActionSuccess;
  constructor(public payload: { id: string }) {}
}

export class DeletePostActionFailure implements Action {
  readonly type = HomeActionTypes.DeletePostActionFailure;
}


export type HomeActions =
  | CreatePostAction
  | CreatePostActionSuccess
  | CreatePostActionFailure
  | GetPostsAction
  | GetPostsActionSuccess
  | GetPostsActionFailure
  | DeletePostAction
  | DeletePostActionSuccess
  | DeletePostActionFailure;
