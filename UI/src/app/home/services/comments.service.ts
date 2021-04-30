import { SnackbarService } from './../../services/snackbar.service';
import { UsersApiService } from './../../services/users.api.service';
import { CommentsApiService } from './../../services/comments.api.service';
import { LoadingService } from './../../services/loading.service';
import { CommentViewModel } from './../models/home-view-model';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import * as moment from 'moment';
import { PagedData, DataFilter, SearchType, SnackbarErrors } from '../../shared/models/common';
import { User, UserRole } from '../../users/user';
import { CommentCmd, GetCommentDto } from '../models/home.models';
import { EnvironmentService } from '../../services/environment.service';
import { BaseService } from 'src/app/shared/models/base.service';

@Injectable()
export class CommentsService extends BaseService<CommentCmd> {
  private _commentsSubject = new Subject<PagedData<CommentViewModel>>();
  private _comments: CommentViewModel[] = [];
  private _total: number;
  private _postId: string;
  private _noMoreComments: boolean;
  private _indexOfEditedComment: number;
  user: User;

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

  constructor(
    private commentsApiService: CommentsApiService,
    private loadingService: LoadingService,
    private usersApiService: UsersApiService,
    environmentService: EnvironmentService,
    snackbarService: SnackbarService,
  ) {
    super(environmentService, snackbarService);
  }

  async getMany(): Promise<void> {
    if (this._noMoreComments) {
      return;
    }

    try {
      this.loadingService.setUILoading();
      const comments = (await this.commentsApiService.findAll(this.paging, this.filter, this.sort)).result;
      const users = (await this.usersApiService.findAll(this.getCommentUsersFilter(comments.items))).result;

      const mappedComments = comments.items.map(c => {
        const author = users.items.find(u => c.authorId === u.id);
        return this.mapCommment(c, author);
      });

      this._comments = this._comments.concat(mappedComments);
      this.paging.skip = this._comments.length;
      this._total = comments.total;
      this._noMoreComments = this._comments.length === this._total;
      this._commentsSubject.next({ items: this._comments, total: this._total });
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.GetComments);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  async create(cmd: CommentCmd): Promise<void> {
    try {
      this.loadingService.setUILoading();
      const comment = (await this.commentsApiService.create(cmd, this.postId)).result;
      const mappedComment = this.mapCommment(comment, this.user);
      this._comments.unshift(mappedComment);
      this._total++;
      this._commentsSubject.next({ items: this._comments, total: this._total });
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.CreateComment);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  async edit(cmd: CommentCmd, id: string): Promise<void> {
    try {
      this.loadingService.setUILoading();
      const comment = (await this.commentsApiService.update(id, cmd)).result;
      const mappedComment = this.mapCommment(comment, this.user);
      this._comments.splice(this._indexOfEditedComment, 0, mappedComment);
      this._commentsSubject.next({ items: this._comments, total: this._total });
      this.snackbarService.showInfo('Comment Edited Successfully');
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.EditComment);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  startEdit(id: string): void {
    this._indexOfEditedComment = this._comments.findIndex(x => x.id === id);
    this._comments.splice(this._indexOfEditedComment, 1);
    this._commentsSubject.next({ items: this._comments, total: this._total });
  }

  cancelEdit(comment: CommentViewModel): void {
    this._comments.splice(this._indexOfEditedComment, 0, comment)
    this._commentsSubject.next({ items: this._comments, total: this._total });
  }

  async delete(id: string): Promise<void> {
    try {
      this.loadingService.setUILoading();
      await this.commentsApiService.delete(id);
      const deletedIndex = this._comments.findIndex(x => x.id === id);
      this._comments.splice(deletedIndex, 1);
      this._total--;
      this._commentsSubject.next({ items: this._comments, total: this._total });
      this.snackbarService.showInfo('Comment Deleted Successfully');
    } catch (error) {
      this.handleFailure(error, SnackbarErrors.DeleteComment);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  clear(): void {
    this._comments = [];
    this._noMoreComments = false;
    this._postId = null;
    this.paging.skip = 0;
    this._total = null;
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

  private mapCommment(comment: GetCommentDto, user: User): CommentViewModel {
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
