import { CreatePostCmd } from '../../home/models/cmd/create-post.cmd';
import { Action } from '@ngrx/store';
import { GetPostDto } from '../../home/models/dto/get-post.dto';

export enum HomeActionTypes {
  CreatePostAction = '[CreatePost] Action',
  CreatePostActionSuccess = '[CreatePostSuccess] Action',
  CreatePostActionFailure = '[CreatePostFailure] Action',

  GetPostsAction = '[GetPostsPost] Action',
  GetPostsActionSuccess = '[GetPostsPostSuccess] Action',
  GetPostsActionFailure = '[GetPostsPostFailure] Action',
}

// CREATE POST
export class CreatePostAction implements Action {
  readonly type = HomeActionTypes.CreatePostAction;
  constructor(public payload: { cmd: CreatePostCmd }) {}
}

export class CreatePostActionSuccess implements Action {
  readonly type = HomeActionTypes.CreatePostActionSuccess;
}

export class CreatePostActionFailure implements Action {
  readonly type = HomeActionTypes.CreatePostActionFailure;
}

// GET POSTS
export class GetPostsAction implements Action {
  readonly type = HomeActionTypes.GetPostsAction;
  // constructor(public payload: { cmd: CreatePostCmd }) {}
}

export class GetPostsActionSuccess implements Action {
  readonly type = HomeActionTypes.GetPostsActionSuccess;
  constructor(public payload: { data: GetPostDto[] }) {}
}

export class GetPostsActionFailure implements Action {
  readonly type = HomeActionTypes.GetPostsActionFailure;
}


export type HomeActions =
  | CreatePostAction
  | CreatePostActionSuccess
  | CreatePostActionFailure
  | GetPostsAction
  | GetPostsActionSuccess
  | GetPostsActionFailure;
