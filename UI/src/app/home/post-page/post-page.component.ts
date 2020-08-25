import { AddItem } from './../models/view/add-item';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../shared/base.component';
import { PostViewModel } from '../models/view/post-view-model';
import { takeUntil, filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import {
  homeStatePosts,
  homeStatePost,
  homeStateisEditSuccessful,
  homeStatePostComments,
  homeStateisEditCommentSuccessful,
} from '../../store/home/home.selectors';
import {
  GetPostAction,
  GetCommentsAction,
  EditCommentAction,
  EditCommentInitiateAction,
  ClearPostsAction,
  ClearPostAction,
  EditCommentCancelAction,
} from '../../store/home/home.actions';
import { User } from '../../users/models/dto/user';
import { userProfile } from '../../store/auth/auth.selectors';
import { CommentViewModel } from '../models/view/comment-view-model';
import { PostContext, PostPageState } from '../models/view/home-view-model';
import { SearchType, DataFilter } from '../../shared/models/common';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
})
export class PostPageComponent extends BaseComponent implements OnInit {
  post: PostViewModel;
  user: User;
  postId: string;
  pageState: PostPageState = PostPageState.Default;
  comments: CommentViewModel[] = [];
  commentToEdit: CommentViewModel;
  take = 5;

  get postContext() {
    return PostContext;
  }

  get postPageState() {
    return PostPageState;
  }

  commentsFilters: DataFilter[] = [];
  editItemPost: AddItem;
  editItemComment: AddItem;

  constructor(private store: Store<HomeState>, private route: ActivatedRoute) {
    super();
    this.postId = this.route.snapshot.params.id;
    this.editItemComment = this.mapEditItemComment();
    this.editItemPost = this.mapEditItemPost();

    this.commentsFilters.push({
      fieldName: 'post',
      searchOperator: SearchType.In,
      searchValue: this.postId,
    });

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStatePost),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.post = x;
        this.editItemPost = this.mapEditItemPost(this.post);
      });

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(userProfile),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.user = x;
        this.editItemPost.userAvatar = this.user.avatar;
        this.editItemComment.userAvatar = this.user.avatar;
      });

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStatePostComments),
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
      .subscribe(x => {
        this.pageState = PostPageState.Default;
        this.editItemComment = this.mapEditItemComment();
      });
  }

  ngOnInit(): void {
    if (!this.post) {
      this.store.dispatch(new GetPostAction({ id: this.postId }));
    }

    this.store.dispatch(
      new GetCommentsAction({
        paging: { skip: this.comments.length, take: this.take },
        filters: this.commentsFilters,
      }),
    );
  }

  onEditPost() {
    this.pageState = PostPageState.EditPost;

    if (this.commentToEdit) {
      this.cancelCommentEdit();
    }
  }

  onCancelPostEdit() {
    this.pageState = PostPageState.Default;
    this.editItemComment = this.mapEditItemComment();
  }

  onCancelCommentEdit() {
    this.editItemComment = this.mapEditItemComment();
    this.cancelCommentEdit();
  }

  onEditComment(id: string) {
    this.pageState = PostPageState.Default;
    this.commentToEdit = this.comments.find(x => x.id === id);
    this.editItemComment = this.mapEditItemComment(this.commentToEdit);
    this.store.dispatch(new EditCommentInitiateAction({ id }));
  }

  onScrollDown() {
    this.store.dispatch(
      new GetCommentsAction({
        paging: { skip: this.comments.length, take: this.take },
        filters: this.commentsFilters,
      }),
    );
  }

  onDestroy() {
    this.store.dispatch(new ClearPostsAction());
    this.store.dispatch(new ClearPostAction());
  }

  mapEditItemPost(x?: PostViewModel): AddItem {
    return {
      isPost: true,
      minLength: 3,
      maxLength: 5000,
      id: x?.id,
      content: x?.content,
      category: x?.categoryEnum,
      userAvatar: this.user?.avatar,
    } as AddItem;
  }

  mapEditItemComment(x?: CommentViewModel): AddItem {
    return {
      isPost: false,
      minLength: 3,
      maxLength: 1000,
      postId: this.postId,
      id: x?.id,
      content: x?.content,
      userAvatar: this.user?.avatar,
    } as AddItem;
  }

  cancelCommentEdit() {
    this.store.dispatch(
      new EditCommentCancelAction({ data: this.commentToEdit }),
    );
    this.commentToEdit = null;
  }
}
