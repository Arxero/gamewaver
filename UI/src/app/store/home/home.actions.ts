import { SortUrl, SidebarNavigationType } from '../../sidebar/models/sidebar-view-model';
import { Sorting, PagedData } from './../../shared/models/common';
import { GetVoteDto } from './../../home/models/dto/get-vote.dto';
import { CreatePostVoteCmd } from './../../home/models/cmd/create-vote.cmd';
import { CreatePostCmd } from '../../home/models/cmd/create-post.cmd';
import { Action } from '@ngrx/store';
import { PostViewModel } from '../../home/models/view/post-view-model';
import { User } from '../../users/models/dto/user';
import { UpdatePostCmd } from '../../home/models/cmd/update-post.cmd';
import { CreateCommentCmd } from '../../home/models/cmd/create-comment.cmd';
import { CommentViewModel } from '../../home/models/view/comment-view-model';
import { ResponseError } from '../../shared/models/response';
import { UpdateCommentCmd } from '../../home/models/cmd/update-comment.cmd';
import { Paging, DataFilter } from '../../shared/models/common';
import { UserActionOnPost, PostContext } from '../../home/models/view/home-view-model';

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
  GetVotedPostsActionSuccess = '[GetVotedPostsAction] Action',

  GetPostAction = '[GetPost] Action',
  GetPostActionSuccess = '[GetPostSuccess] Action',
  SetPostPagePost = '[SetPostPagePost] Action',

  DeletePostAction = '[DeletePost] Action',
  DeletePostActionSuccess = '[DeletePostSuccess] Action',

  SidebarNavigation = '[SidebarNavigation] Action',

  // VOTES
  CreatePostUpvoteAction = '[CreatePostUpvote] Action',
  CreatePostUpvoteActionSuccess = '[CreatePostUpvoteSuccess] Action',

  DeletePostUpvoteAction = '[DeletePostUpvote] Action',
  DeletePostUpvoteActionSuccess = '[DeletePostUpvoteSuccess] Action',
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

export class GetVotedPostsActionSuccess implements Action {
  readonly type = HomeActionTypes.GetVotedPostsActionSuccess;
  constructor(public payload: { data: PostViewModel[] }) {}
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
  constructor(public payload: { id: string, postContext?: PostContext }) {}
}

export class DeletePostActionSuccess implements Action {
  readonly type = HomeActionTypes.DeletePostActionSuccess;
  constructor(public payload: { id: string,  postContext?: PostContext }) {}
}

export class SidebarNavigation implements Action {
  readonly type = HomeActionTypes.SidebarNavigation;
  constructor(public payload: { sidebarNavigation: SidebarNavigationType }) {}
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

export type HomeActions =
  | CreatePostAction
  | CreatePostActionSuccess
  | EditPostAction
  | EditPostActionSuccess
  | GetPostsAction
  | GetPostsActionSuccess
  | GetVotedPostsActionSuccess
  | SidebarNavigation
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
  | DeletePostUpvoteActionSuccess;
