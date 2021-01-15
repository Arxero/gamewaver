import { commentsStatePostComments } from '../store/comments/comments.selectors';
import { EnvironmentService } from '../services/environment.service';
import { AddItem } from './models/add-item';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../store/home/home.reducer';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../shared/base.component';
import { PostViewModel } from './models/post-view-model';
import { takeUntil, filter } from 'rxjs/operators';
import {
  homeStatePost,
  homeStateisEditSuccessful,
} from '../store/home/home.selectors';
import {
  GetPostAction,
  ClearPostAction,
} from '../store/home/home.actions';
import { CommentViewModel } from './models/comment-view-model';
import { PostContext, PostPageState } from './models/home-view-model';
import { SearchType, DataFilter, PagedData } from '../shared/models/common';
import { UserViewModel } from '../users/user-view-models';
import {
  GetCommentsAction,
  EditCommentInitiateAction,
  ClearCommentsAction,
  EditCommentCancelAction,
} from '../store/comments/comments.actions';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
})
export class PostPageComponent extends BaseComponent implements OnInit {
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
    return (
      this.pageState === this.postPageState.Default ||
      this.pageState === this.postPageState.EditComment
    );
  }

  editItemPost: AddItem;
  editItemComment: AddItem;

  constructor(
    private store: Store<HomeState>,
    private route: ActivatedRoute,
    private environmentService: EnvironmentService,
  ) {
    super();
    this.postId = this.route.snapshot.params.id;
    this.user = this.route.snapshot.data.userData;
    this.editItemPost = this.mapEditItem(true);
    this.editItemComment = this.mapEditItem();

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStatePost),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.post = x;
        this.editItemPost.id = x.id;
        this.editItemPost.content = x.content;
        this.editItemPost.category = x.categoryEnum;
      });

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(commentsStatePostComments),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.comments = x;
      });

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStateisEditSuccessful),
        filter(x => !!x),
      )
      .subscribe(() => {
        this.pageState = PostPageState.Default;
        this.editItemComment = this.mapEditItem();
      });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetPostAction({ id: this.postId }));
    this.loadComments();
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
    this.store.dispatch(new EditCommentInitiateAction({ id }));
  }

  onScrollDown() {
    if (
      this.comments.total === this.comments.items.length ||
      this.pageState === this.postPageState.EditComment
    ) {
      return;
    }
    this.loadComments();
  }

  private loadComments() {
    const filters: DataFilter[] = [
      {
        fieldName: 'post',
        searchOperator: SearchType.In,
        searchValue: this.postId,
      },
    ];

    this.store.dispatch(
      new GetCommentsAction({
        paging: {
          skip: this.comments ? this.comments.items.length : 0,
          take: this.environmentService.take,
        },
        filters,
      }),
    );
  }

  onDestroy() {
    this.store.dispatch(new ClearPostAction());
    this.store.dispatch(new ClearCommentsAction());
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
    this.store.dispatch(
      new EditCommentCancelAction({ data: this.commentToEdit }),
    );
    this.commentToEdit = null;
  }
}
