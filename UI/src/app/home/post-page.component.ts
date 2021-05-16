import { AuthService } from '@gamewaver/auth';
import { AddItem } from '@gamewaver/add-item';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { PostContext, PostPageState, CommentViewModel, PostViewModel } from './models/home-view-model';
import { UserViewModel } from '@gamewaver/users';
import { CommentsService } from './services/comments.service';
import { PostsService } from './services/posts.service';
import { OnDestroyCleanup, PagedData } from '@gamewaver/shared';

@Component({
  selector: 'gw-post-page',
  templateUrl: './post-page.component.html',
})
export class PostPageComponent extends OnDestroyCleanup implements OnInit, OnDestroy {
  post: PostViewModel;
  user: UserViewModel;
  pageState: PostPageState = PostPageState.Default;
  comments: PagedData<CommentViewModel>;
  commentToEdit: CommentViewModel;
  postContext = PostContext;
  postPageState = PostPageState;
  editItemPost: AddItem;
  editItemComment: AddItem;

  get isDefaultOrEditComment(): boolean {
    return this.pageState === this.postPageState.Default || this.pageState === this.postPageState.EditComment;
  }

  constructor(
    private route: ActivatedRoute,
    private commentsService: CommentsService,
    private postsService: PostsService,
    private authService: AuthService,
  ) {
    super();
    this.post = this.route.snapshot.data.post;
    this.editItemPost = this.mapEditItem(true);
    this.editItemComment = this.mapEditItem();
    this.commentsService.postId = this.post.id;

    this.authService.profile$.pipe(takeUntil(this.destroyed$)).subscribe(x => {
      this.user = x;
      this.editItemComment.userAvatar = this.user?.avatar;
      this.commentsService.user = this.user;
    });

    this.postsService.post$.pipe(takeUntil(this.destroyed$)).subscribe(x => {
      this.post = x;
      this.pageState = PostPageState.Default;
    });

    this.commentsService.comments$.pipe(takeUntil(this.destroyed$)).subscribe(x => (this.comments = x));
  }

  ngOnInit(): void {
    this.commentsService.getMany();
  }

  onEditPost(): void {
    this.pageState = PostPageState.EditPost;
    this.editItemPost.id = this.post.id;
    this.editItemPost.content = this.post.content;
    this.editItemPost.category = this.post.category;
    this.editItemPost.userAvatar = this.user.avatar;

    if (this.commentToEdit) {
      this.cancelCommentEdit();
    }
  }

  onCancelPostEdit(): void {
    this.pageState = PostPageState.Default;
    this.editItemComment = this.mapEditItem();
  }

  onCancelCommentEdit(): void {
    this.editItemComment = this.mapEditItem();
    this.cancelCommentEdit();
  }

  onEditComment(id: string): void {
    this.pageState = PostPageState.EditComment;
    this.commentToEdit = this.comments.items.find(x => x.id === id);
    this.editItemComment = {
      ...this.editItemComment,
      id: this.commentToEdit.id,
      content: this.commentToEdit.content,
    };
    this.commentsService.startEdit(id);
  }

  onScrollDown(): void {
    if (this.pageState === this.postPageState.EditComment) {
      return;
    }

    this.commentsService.getMany();
  }

  onDestroy(): void {
    this.commentsService.clear();
  }

  private mapEditItem(isPost?: boolean): AddItem {
    return {
      isPost,
      minLength: 3,
      maxLength: isPost ? 5000 : 1000,
      userAvatar: this.user?.avatar,
    };
  }

  private cancelCommentEdit(): void {
    this.commentsService.cancelEdit(this.commentToEdit);
    this.commentToEdit = null;
  }
}
