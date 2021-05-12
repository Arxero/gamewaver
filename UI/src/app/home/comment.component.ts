import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User, UserRole } from '../users/user';
import { PostContext, CommentViewModel } from './models/home-view-model';
import { CommentsService } from './services/comments.service';
import { usersProfileFullRoute } from '../users/user-view-models';
import { OnDestroyCleanup } from '@gamewaver/shared';

@Component({
  selector: 'gw-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent extends OnDestroyCleanup implements OnInit {
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
      ? `../../${usersProfileFullRoute(this.comment.authorId)}`
      : `../${usersProfileFullRoute(this.comment.authorId)}`;
  }

  constructor(
    private commentsService: CommentsService) {
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
    this.commentsService.delete(this.comment.id)
  }
}
