import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { Store } from '@ngrx/store';
import { HomeState } from '../store/home/home.reducer';
import { usersProfileFullRoute } from '../users/users.routing';
import { User, UserRole } from '../users/user';
import { PostContext, CommentViewModel } from './models/home-view-model';
import { ActivatedRoute } from '@angular/router';
import { DeleteCommentAction } from '../store/comments/comments.actions';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent extends BaseComponent implements OnInit {
  @Input() comment: CommentViewModel;
  @Input() user: User;
  @Input() postContext: PostContext;
  postRoute: {[key: number]: string} = {
    [PostContext.PostsPage] : `post`,
    [PostContext.ProfilePage]: '../../../../post'
  };

  canEditOrDelete: boolean;
  @Input() postAuthorId: string;
  @Output() editComment: EventEmitter<string> = new EventEmitter();
  get postContexts() {
    return PostContext;
  }

  get userProfileRoute(): string {
    return this.postContext === PostContext.PostPage
      ? `../../${usersProfileFullRoute()}`
      : `../${usersProfileFullRoute()}`;
  }

  constructor(
    private store: Store<HomeState>) {
    super();
  }

  ngOnInit(): void {
    if (!this.user) {
      return;
    }

    this.canEditOrDelete =
      this.user.id === this.comment?.authorId ||
      this.user.role === UserRole.ADMIN
        ? true
        : false;
  }

  onEdit() {
    this.editComment.emit(this.comment.id);
  }

  onDelete() {
    this.store.dispatch(new DeleteCommentAction({ id: this.comment.id }));
  }
}
