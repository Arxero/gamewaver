import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User, usersProfileFullRoute } from '@gamewaver/users';
import { PostContext, CommentViewModel } from './models';
import { CommentsService } from './services';
import { OnDestroyCleanup, UserRole } from '@gamewaver/shared';

@Component({
  selector: 'gw-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent extends OnDestroyCleanup implements OnInit {
  @Input() comment: CommentViewModel;
  @Input() user: User;
  @Input() postContext: PostContext;
  @Input() postAuthorId: string;
  @Output() editComment: EventEmitter<string> = new EventEmitter();
  canEditOrDelete: boolean;
  postContexts = PostContext;

  postRoute: { [key: number]: string } = {
    [PostContext.PostsPage]: `post`,
    [PostContext.ProfilePage]: '../../../../post',
  };

  get userProfileRoute(): string {
    return this.postContext === PostContext.PostPage
      ? `../../${usersProfileFullRoute(this.comment.authorId)}`
      : `../${usersProfileFullRoute(this.comment.authorId)}`;
  }

  constructor(private commentsService: CommentsService) {
    super();
  }

  ngOnInit(): void {
    if (!this.user) {
      return;
    }

    this.canEditOrDelete =
      this.user.id === this.comment?.authorId || this.user.role === UserRole.ADMIN ? true : false;
  }

  onEdit(): void {
    this.editComment.emit(this.comment.id);
  }

  onDelete(): void {
    this.commentsService.delete(this.comment.id);
  }
}
