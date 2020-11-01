import { PostPageResolver, IPostPage } from './post-page.resolver';
import { EnvironmentService } from './../../services/environment.service';
import { AddItem } from './../models/view/add-item';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../shared/base.component';
import { PostViewModel } from '../models/view/post-view-model';
import { takeUntil, filter, tap, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import {
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
import { UserViewModel } from 'src/app/users/models/view/user-view-model';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
})
export class PostPageComponent extends BaseComponent implements OnInit {
  post: PostViewModel;
  user: UserViewModel;
  postId: string;
  pageState: PostPageState = PostPageState.Default;
  comments: CommentViewModel[] = [];
  commentToEdit: CommentViewModel;

  get postContext() {
    return PostContext;
  }

  get postPageState() {
    return PostPageState;
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
    this.editItemPost = this.mapEditItemPost();
    this.editItemComment = this.mapEditItemComment();

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
          skip: this.comments ? this.comments.length : 0,
          take: this.environmentService.take,
        },
        filters,
      }),
    );
  }

  onDestroy() {
    this.store.dispatch(new ClearPostAction());
    this.store.dispatch(new ClearPostsAction());
  }

  private mapEditItemPost(x?: PostViewModel): AddItem {
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

  private mapEditItemComment(x?: CommentViewModel): AddItem {
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

  private cancelCommentEdit() {
    this.store.dispatch(
      new EditCommentCancelAction({ data: this.commentToEdit }),
    );
    this.commentToEdit = null;
  }
}
