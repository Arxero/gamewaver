import { CreatePostCmd } from '../../home/models/cmd/create-post.cmd';
import { Action } from '@ngrx/store';

export enum HomeActionTypes {
  CreatePostAction = '[CreatePost] Action',
  CreatePostActionSuccess = '[CreatePostSuccess] Action',
  CreatePostActionFailure = '[CreatePostFailure] Action',
}


export class CreatePostAction implements Action {
  readonly type = HomeActionTypes.CreatePostAction;
  constructor(public payload: { cmd: CreatePostCmd }) {}
}

export class CreatePostActionSuccess implements Action {
  readonly type = HomeActionTypes.CreatePostActionSuccess;
  // constructor(public payload: { user: User }) {}
}

export class CreatePostActionFailure implements Action {
  readonly type = HomeActionTypes.CreatePostActionFailure;
}

export type HomeActions =
  | CreatePostAction
  | CreatePostActionSuccess
  | CreatePostActionFailure;
