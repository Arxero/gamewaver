import { AddItem } from '../add-item/add-item.models';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OnDestroyCleanup } from '../shared/on-destory-cleanup';
import { takeUntil } from 'rxjs/operators';
import { PostContext, PostPageState, CommentViewModel, PostViewModel } from './models/home-view-model';
import { PagedData } from '../shared/models/common';
import { UserViewModel } from '../users/user-view-models';
import { CommentsService } from './services/comments.service';
import { PostsService } from './services/posts.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
})
export class PostPageComponent extends OnDestroyCleanup implements OnInit, OnDestroy {
  post: PostViewModel;
  user: UserViewModel;
  postId: string;
  pageState: PostPageState = PostPageState.Default;
  comments: PagedData<CommentViewModel>;
  commentToEdit: CommentViewModel;

  get postContext() {
    return PostContext;
  }

  get postPageState() {
    return PostPageState;
  }

  get isDefaultOrEditComment(): boolean {
    return this.pageState === this.postPageState.Default || this.pageState === this.postPageState.EditComment;
  }

  editItemPost: AddItem;
  editItemComment: AddItem;

  constructor(
    private route: ActivatedRoute,
    private commentsService: CommentsService,
    private postsService: PostsService,
  ) {
    super();
    this.postId = this.route.snapshot.params.id;
    this.user = this.route.snapshot.data.userData;
    this.editItemPost = this.mapEditItem(true);
    this.editItemComment = this.mapEditItem();

    this.commentsService.postId = this.postId;
    this.commentsService.user = this.user;
    this.postsService.post$.pipe(takeUntil(this.destroyed$)).subscribe(x => {
      this.post = x;
      this.editItemPost.id = x.id;
      this.editItemPost.content = x.content;
      this.editItemPost.category = x.category;
      this.pageState = PostPageState.Default;
      this.editItemComment = this.mapEditItem();
    });

    commentsService.comments$.pipe(takeUntil(this.destroyed$)).subscribe(x => {
      this.comments = x;
    });
  }

  ngOnInit(): void {
    this.postsService.getOne(this.postId);
    this.commentsService.getMany();
  }

  onEditPost() {
    this.pageState = PostPageState.EditPost;

    if (this.commentToEdit) {
      this.cancelCommentEdit();
    }
  }

  onCancelPostEdit() {
    this.pageState = PostPageState.Default;
    this.editItemComment = this.mapEditItem();
  }

  onCancelCommentEdit() {
    this.editItemComment = this.mapEditItem();
    this.cancelCommentEdit();
  }

  onEditComment(id: string) {
    this.pageState = PostPageState.EditComment;
    this.commentToEdit = this.comments.items.find(x => x.id === id);
    this.editItemComment = {
      ...this.editItemComment,
      id: this.commentToEdit.id,
      content: this.commentToEdit.content,
    };
    this.commentsService.startEdit(id);
  }

  onScrollDown() {
    if (this.pageState === this.postPageState.EditComment) {
      return;
    }

    this.commentsService.getMany();
  }

  onDestroy() {
    this.commentsService.clear();
  }

  private mapEditItem(isPost: boolean = false): AddItem {
    return {
      isPost,
      minLength: 3,
      maxLength: isPost ? 5000 : 1000,
      userAvatar: this.user?.avatar,
      postId: this.postId,
    };
  }

  private cancelCommentEdit() {
    this.commentsService.cancelEdit(this.commentToEdit);
    this.commentToEdit = null;
  }
}
