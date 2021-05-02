import { SimpleChange } from '@angular/core';

export interface PagedData<T> {
  total: number;
  items: T[];
}

export interface Paging {
  skip: number;
  take: number;
}

export interface DataEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum SortDirection {
  Unknown = 'Unknown',
  ASC = 'asc',
  DESC = 'desc',
}

export interface Sorting {
  propertyName: string;
  sort: SortDirection;
}

export enum SearchType {
  Unknown = 'unknown',
  Equal = 'eq',
  Not = 'ne',
  MoreThan = 'gt',
  MoreThanOrEqual = 'gte',
  LessThan = 'lt',
  LessThanOrEqual = 'lte',
  Like = 'like',
  Between = 'between',
  In = 'in',
  Any = 'any',
  IsNull = 'isNull',
}

export interface DataFilter {
  fieldName: string;
  searchOperator: SearchType;
  searchValue: any;
}

export interface DataFilterDef {
  filters: DataFilter[];
}

export interface SortingDef {
  sorting: Sorting[];
}

export interface BaseCmd {
  reCaptchaaToken: string;
}

export const dateSort: Sorting = {
  propertyName: 'createdAt',
  sort: SortDirection.DESC,
};

export interface TypedChange<T> extends SimpleChange {
  previousValue: T;
  currentValue: T;
}

export enum SnackbarErrors {
  GetPosts = 'Get Posts Failed',
  GetPost = 'Get Post Failed',
  CreatePost = 'Create Post Failed',
  EditPost = 'Edit Post Failed',
  DeletePost = 'Delete Post Failed',

  GetComments = 'Get Comments Failed',
  CreateComment  = 'Create Comment Failed',
  EditComment = 'Edit Comment Failed',
  DeleteComment ='Delete Comment Failed',

  CreateVote = 'Create Vote Failed',
  DeleteVote = 'Delete Vote Failed',

  GetUser = 'Get User Failed',
  EditUser = 'Edit User Failed',

  Register = 'Registration Failed',
  Login = 'Login Failed',
  ForgotPassword = 'Forgot Password Failed',
  ResetPassword = 'Reset Password Failed',
}
