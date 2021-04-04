import { Injectable } from '@angular/core';
import { CommentsApiService } from '../services/comments.api.service';
import { LoadingService } from '../services/loading.service';
import { UsersService } from '../services/users.service';
import { PagedData, Sorting, SortDirection, Paging, DataFilter, SearchType } from '../shared/models/common';
import { CommentViewModel, GetCommentDto } from './models';
import { Subject, Observable } from 'rxjs';
import { User, UserRole } from '../users/user';
import * as moment from 'moment';
import { EnvironmentService } from '../services/environment.service';
import { SnackbarService } from '../services/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  isEditCommentSuccessful: boolean;
  indexOfEditedComment: number;

  private _commentsSubject = new Subject<PagedData<CommentViewModel>>();
  private _comments: CommentViewModel[] = [];
  private _postId: string;
  private _noMoreComments: boolean;

  get comments$(): Observable<PagedData<CommentViewModel>> {
    return this._commentsSubject.asObservable();
  }

  set postId(v: string) {
    this._postId = v;
    this.filter[0].searchValue = v;
  }

  get postId(): string {
    return this._postId;
  }

  private sort: Sorting[] = [
    {
      propertyName: 'createdAt',
      sort: SortDirection.DESC,
    },
  ];

  private filter: DataFilter[] = [
    {
      fieldName: 'post',
      searchOperator: SearchType.In,
      searchValue: null,
    },
  ];

  private paging: Paging = {
    skip: 0,
    take: 10,
  };

  constructor(
    private commentsApiService: CommentsApiService,
    private loadingService: LoadingService,
    private usersService: UsersService,
    private environmentService: EnvironmentService,
    private snackbarService: SnackbarService,
  ) {
    this.paging.take = environmentService.take;
  }

  async loadComments(): Promise<void> {
    if (this._noMoreComments) {
      return;
    }

    try {
      this.loadingService.setUILoading();
      const comments = (await this.commentsApiService.findAll(this.paging, this.filter, this.sort)).result;
      const users = (await this.usersService.findAll(this.getCommentUsersFilter(comments.items))).result;

      const mappedComments = comments.items.map(c => {
        const author = users.items.find(u => c.authorId === u.id);
        return this.mapCommmentViewModel(c, author);
      });

      this.paging.skip = mappedComments.length;
      this._comments = this._comments.concat(mappedComments);
      this._noMoreComments = this._comments.length === comments.total;
      this._commentsSubject.next({ items: this._comments, total: comments.total });
    } catch ({ error }) {
      this.snackbarService.showWarn('Get Comments Failed ' + error.message);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  clear(): void {
    this._comments = [];
    this._noMoreComments = false;
    this._postId = null;
    this.paging = { skip: 0, take: 10 };
  }

  private getCommentUsersFilter(comments: GetCommentDto[]): DataFilter[] {
    const uniqueUsers = comments
      .map(x => x.authorId)
      .filter((v, i, s) => s.indexOf(v) === i)
      .join(',');

    return [
      {
        fieldName: 'id',
        searchOperator: SearchType.In,
        searchValue: uniqueUsers,
      },
    ];
  }

  private mapCommmentViewModel(comment: GetCommentDto, user: User): CommentViewModel {
    return {
      id: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      postId: comment.postId,
      avatar: user.avatar,
      username: user.username,
      date: comment.createdAt.toString(),
      tooltipDate: moment(comment.createdAt).format('MMMM DD, YYYY [at] hh:mm A'),
      userRole: user.role !== UserRole.USER ? user.role : null,
    } as CommentViewModel;
  }
}
