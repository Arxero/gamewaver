import { CreateCommentCmd, UpdateCommentCmd } from './../../home/models/home.models';
import { Paging, DataFilter, PagedData } from './../../shared/models/common';
import { CommentViewModel } from '../../home/models/comment-view-model';
import { Action } from '@ngrx/store';


export enum CommentsActionTypes {
  CreateCommentAction = '[CreateComment] Action',
  CreateCommentActionSuccess = '[CreateCommentSuccess] Action',

  GetCommentsAction = '[GetCommentsPost] Action',
  GetCommentsActionSuccess = '[GetCommentsSuccess] Action',

  DeleteCommentAction = '[DeleteComment] Action',
  DeleteCommentActionSuccess = '[DeleteCommentSuccess] Action',
  DeleteCommentActionFailure = '[DeleteCommentFailure] Action',

  EditCommentInitiateAction = '[EditCommentInitiate] Action',
  EditCommentCancelAction = '[EditCommentCancel] Action',
  EditCommentAction = '[EditComment] Action',
  EditCommentActionSuccess = '[EditCommentSuccess] Action',

  ClearCommentsAction = '[ClearComments] Action',
}

// CREATE
export class CreateCommentAction implements Action {
  readonly type = CommentsActionTypes.CreateCommentAction;
  constructor(public payload: { cmd: CreateCommentCmd; postId: string }) {}
}

export class CreateCommentActionSuccess implements Action {
  readonly type = CommentsActionTypes.CreateCommentActionSuccess;
  constructor(public payload: { data: CommentViewModel }) {}
}

// GET
export class GetCommentsAction implements Action {
  readonly type = CommentsActionTypes.GetCommentsAction;
  constructor(public payload: { paging: Paging; filters?: DataFilter[] }) {}
}

export class GetCommentsActionSuccess implements Action {
  readonly type = CommentsActionTypes.GetCommentsActionSuccess;
  constructor(public payload: { data: PagedData<CommentViewModel> }) {}
}

// DELETE
export class DeleteCommentAction implements Action {
  readonly type = CommentsActionTypes.DeleteCommentAction;
  constructor(public payload: { id: string }) {}
}

export class DeleteCommentActionSuccess implements Action {
  readonly type = CommentsActionTypes.DeleteCommentActionSuccess;
  constructor(public payload: { id: string }) {}
}

// EDIT
export class EditCommentInitiateAction implements Action {
  readonly type = CommentsActionTypes.EditCommentInitiateAction;
  constructor(public payload: { id: string }) {}
}

export class EditCommentCancelAction implements Action {
  readonly type = CommentsActionTypes.EditCommentCancelAction;
  constructor(public payload: { data: CommentViewModel }) {}
}

export class EditCommentAction implements Action {
  readonly type = CommentsActionTypes.EditCommentAction;
  constructor(public payload: { cmd: UpdateCommentCmd; id: string }) {}
}

export class EditCommentActionSuccess implements Action {
  readonly type = CommentsActionTypes.EditCommentActionSuccess;
  constructor(public payload: { data: CommentViewModel }) {}
}

export class ClearCommentsAction implements Action {
  readonly type = CommentsActionTypes.ClearCommentsAction;
}

export type CommentsActions =
  | CreateCommentAction
  | CreateCommentActionSuccess
  | GetCommentsAction
  | GetCommentsActionSuccess
  | DeleteCommentAction
  | DeleteCommentActionSuccess
  | EditCommentInitiateAction
  | EditCommentCancelAction
  | EditCommentAction
  | EditCommentActionSuccess
  | ClearCommentsAction;
