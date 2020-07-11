import { Component, OnInit, Input } from '@angular/core';
import { CommentViewModel } from '../models/view/comment-view-model';
import { BaseComponent } from '../../shared/base.component';
import { Store } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { usersProfileFullRoute } from '../../users/users.routing';
import { User, UserRole } from '../../users/models/dto/user';
import { DeleteCommentAction } from '../../store/home/home.actions';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent extends BaseComponent implements OnInit {
  @Input() comment: CommentViewModel;
  @Input() user: User;
  canEditOrDelete: boolean;
  get userProfileRoute() {
    return usersProfileFullRoute();
  }

  constructor(private store: Store<HomeState>) {
    super();
  }

  ngOnInit(): void {
    this.canEditOrDelete =
      this.user.id === this.comment?.authorId ||
      this.user.role === UserRole.ADMIN
        ? true
        : false;
  }

  onEdit() {}

  onDelete() {
    this.store.dispatch(new DeleteCommentAction({ id: this.comment.id }));
  }
}
