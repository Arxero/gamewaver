import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostViewModel } from '../models/view/post-view-model';
import { usersProfileFullRoute } from '../../users/users.routing';
import { DeletePostAction } from '../../store/home/home.actions';
import { Store } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { UserRole, User } from '../../users/models/dto/user';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  @Input() post: PostViewModel;
  @Input() isSingle: boolean;
  @Input() user: User;
  canEditOrDelete: boolean;
  @Output() editPost: EventEmitter<void> = new EventEmitter();
  get userProfileRoute() {
    return this.isSingle ? `../../${usersProfileFullRoute()}` : `../${usersProfileFullRoute()}`;
  }

  constructor(private store: Store<HomeState>) {}

  ngOnInit(): void {
    if (!this.user) {
      return;
    }

    this.canEditOrDelete =
      this.user.id === this.post?.authorId || this.user.role === UserRole.ADMIN
        ? true
        : false;
  }

  onEdit() {
    this.editPost.emit();
  }

  onDelete() {
    this.store.dispatch(new DeletePostAction({ id: this.post.id }));
  }
}
