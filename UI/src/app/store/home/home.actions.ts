import { CreatePostCmd } from '../../home/models/cmd/create-post.cmd';
import { Action } from '@ngrx/store';
import { PostViewModel } from '../../home/models/view/post-view-model';
import { User } from '../../users/models/dto/user';
import { UpdatePostCmd } from '../../home/models/cmd/update-post.cmd';
import { CreateCommentCmd } from '../../home/models/cmd/create-comment.cmd';
import { CommentViewModel } from '../../home/models/view/comment-view-model';
import { ResponseError } from '../../shared/models/response';
import { UpdateCommentCmd } from '../../home/models/cmd/update-comment.cmd';

export enum HomeActionTypes {
  // POSTS
  CreatePostAction = '[CreatePost] Action',
  CreatePostActionSuccess = '[CreatePostSuccess] Action',
  CreatePostActionFailure = '[CreatePostFailure] Action',

  EditPostAction = '[EditPost] Action',
  EditPostActionSuccess = '[EditPostSuccess] Action',
  EditPostActionFailure = '[EditPostFailure] Action',

  GetPostsAction = '[GetPostsPost] Action',
  GetPostsActionSuccess = '[GetPostsSuccess] Action',
  GetPostsActionFailure = '[GetPostsFailure] Action',

  GetPostAction = '[GetPost] Action',
  GetPostActionSuccess = '[GetPostSuccess] Action',
  GetPostActionFailure = '[GetPostFailure] Action',

  DeletePostAction = '[DeletePost] Action',
  DeletePostActionSuccess = '[DeletePostSuccess] Action',
  DeletePostActionFailure = '[DeletePostFailure] Action',

  // COMMENTS
  CreateCommentAction = '[CreateComment] Action',
  CreateCommentActionSuccess = '[CreateCommentSuccess] Action',
  CreateCommentActionFailure = '[CreateCommentFailure] Action',

  GetCommentsAction = '[GetCommentsPost] Action',
  GetCommentsActionSuccess = '[GetCommentsSuccess] Action',
  GetCommentsActionFailure = '[GetCommentsFailure] Action',

  DeleteCommentAction = '[DeleteComment] Action',
  DeleteCommentActionSuccess = '[DeleteCommentSuccess] Action',
  DeleteCommentActionFailure = '[DeleteCommentFailure] Action',

  EditCommentInitiateAction = '[EditCommentInitiate] Action',
  EditCommentCancelAction = '[EditCommentCancel] Action',
  EditCommentAction = '[EditComment] Action',
  EditCommentActionSuccess = '[EditCommentSuccess] Action',
  EditCommentActionFailure = '[EditCommentFailure] Action',
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

// EDIT POST
export class EditPostAction implements Action {
  readonly type = HomeActionTypes.EditPostAction;
  constructor(public payload: { cmd: UpdatePostCmd, id: string }) {}
}

export class EditPostActionSuccess implements Action {
  readonly type = HomeActionTypes.EditPostActionSuccess;
  constructor(public payload: { id: string }) {}
}

export class EditPostActionFailure implements Action {
  readonly type = HomeActionTypes.EditPostActionFailure;
}

// GET POSTS
export class GetPostsAction implements Action {
  readonly type = HomeActionTypes.GetPostsAction;
}

export class GetPostsActionSuccess implements Action {
  readonly type = HomeActionTypes.GetPostsActionSuccess;
  constructor(public payload: { data: PostViewModel[] }) {}
}

export class GetPostsActionFailure implements Action {
  readonly type = HomeActionTypes.GetPostsActionFailure;
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

export class GetPostActionFailure implements Action {
  readonly type = HomeActionTypes.GetPostActionFailure;
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

// CREATE COMMENT
export class CreateCommentAction implements Action {
  readonly type = HomeActionTypes.CreateCommentAction;
  constructor(public payload: { cmd: CreateCommentCmd, postId: string }) {}
}

export class CreateCommentActionSuccess implements Action {
  readonly type = HomeActionTypes.CreateCommentActionSuccess;
  constructor(public payload: { data: CommentViewModel }) {}
}

export class CreateCommentActionFailure implements Action {
  readonly type = HomeActionTypes.CreateCommentActionFailure;
}

// GET COMMENTS
export class GetCommentsAction implements Action {
  readonly type = HomeActionTypes.GetCommentsAction;
  constructor(public payload: { postId: string }) {}
}

export class GetCommentsActionSuccess implements Action {
  readonly type = HomeActionTypes.GetCommentsActionSuccess;
  constructor(public payload: { data: CommentViewModel[] }) {}
}

export class GetCommentsActionFailure implements Action {
  readonly type = HomeActionTypes.GetCommentsActionFailure;
}

// DELETE COMMENT
export class DeleteCommentAction implements Action {
  readonly type = HomeActionTypes.DeleteCommentAction;
  constructor(public payload: { id: string }) {}
}

export class DeleteCommentActionSuccess implements Action {
  readonly type = HomeActionTypes.DeleteCommentActionSuccess;
  constructor(public payload: { id: string }) {}
}

export class DeleteCommentActionFailure implements Action {
  readonly type = HomeActionTypes.DeleteCommentActionFailure;
  constructor(public payload: { error: ResponseError }) {}
}

// EDIT POST
export class EditCommentInitiateAction implements Action {
  readonly type = HomeActionTypes.EditCommentInitiateAction;
  constructor(public payload: { id: string }) {}
}

export class EditCommentCancelAction implements Action {
  readonly type = HomeActionTypes.EditCommentCancelAction;
  constructor(public payload: { data: CommentViewModel }) {}
}

export class EditCommentAction implements Action {
  readonly type = HomeActionTypes.EditCommentAction;
  constructor(public payload: { cmd: UpdateCommentCmd, id: string }) {}
}

export class EditCommentActionSuccess implements Action {
  readonly type = HomeActionTypes.EditCommentActionSuccess;
  constructor(public payload: { data: CommentViewModel }) {}
}

export class EditCommentActionFailure implements Action {
  readonly type = HomeActionTypes.EditCommentActionFailure;
  constructor(public payload: { error: ResponseError }) {}

}



export type HomeActions =
  | CreatePostAction
  | CreatePostActionSuccess
  | CreatePostActionFailure
  | EditPostAction
  | EditPostActionSuccess
  | EditPostActionFailure
  | GetPostsAction
  | GetPostsActionSuccess
  | GetPostsActionFailure
  | DeletePostAction
  | DeletePostActionSuccess
  | DeletePostActionFailure
  | GetPostAction
  | GetPostActionSuccess
  | GetPostActionFailure
  | CreateCommentAction
  | CreateCommentActionSuccess
  | CreateCommentActionFailure
  | GetCommentsAction
  | GetCommentsActionSuccess
  | GetCommentsActionFailure
  | DeleteCommentAction
  | DeleteCommentActionSuccess
  | DeleteCommentActionFailure
  | EditCommentInitiateAction
  | EditCommentCancelAction
  | EditCommentAction
  | EditCommentActionSuccess
  | EditCommentActionFailure;
