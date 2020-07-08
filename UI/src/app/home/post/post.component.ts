import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostViewModel } from '../models/view/post-view-model';
import { usersProfileFullRoute } from '../../users/users.routing';
import { DeletePostAction } from '../../store/home/home.actions';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../../store/auth/auth.selectors';
import { cloneDeep } from 'lodash';
import { UserRole } from '../../users/models/dto/user';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent extends BaseComponent implements OnInit {
  @Input() post: PostViewModel;
  @Input() isSingle: boolean;
  canEditOrDelete: boolean;
  isAddComment: boolean;
  @Output() editPost: EventEmitter<void> = new EventEmitter();
  @Output() addComment: EventEmitter<boolean> = new EventEmitter();
  get userProfileRoute() {
    return usersProfileFullRoute();
  }

  constructor(private store: Store<HomeState>) {
    super();
  }

  ngOnInit(): void {
    this.store
      .pipe(
        takeUntil(this.destroyed$),
        select(userProfile),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.canEditOrDelete =
          x.id === this.post?.authorId || x.role === UserRole.ADMIN
            ? true
            : false;
      });
  }

  onReply() {
    this.isAddComment = !this.isAddComment;
    this.addComment.emit(this.isAddComment);
  }

  onEdit() {
    this.isAddComment = false;
    this.addComment.emit(this.isAddComment);
    this.editPost.emit();
  }

  onDelete() {
    this.store.dispatch(new DeletePostAction({ id: this.post.id }));
  }
}
