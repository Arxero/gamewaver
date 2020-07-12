import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../shared/base.component';
import { PostViewModel } from '../models/view/post-view-model';
import { takeUntil, filter } from 'rxjs/operators';
import {
  homeStatePosts,
  homeStatePost,
  homeStateisEditSuccessful,
  homeStatePostComments,
} from '../../store/home/home.selectors';
import {
  GetPostAction,
  GetCommentsAction,
} from '../../store/home/home.actions';
import { User } from '../../users/models/dto/user';
import { userProfile } from '../../store/auth/auth.selectors';
import { CommentViewModel } from '../models/view/comment-view-model';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
})
export class PostPageComponent extends BaseComponent implements OnInit {
  post: PostViewModel;
  user: User;
  postId: string;
  isEditPost: boolean;
  isAddComment = true;
  comments: CommentViewModel[];
  comment: CommentViewModel;

  constructor(private store: Store<HomeState>, private route: ActivatedRoute) {
    super();
    this.postId = this.route.snapshot.params.id;

    // load post when its clicked from home page
    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStatePosts),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.post = x.find(p => p.id === this.postId);
      });

    // load post when by link
    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStatePost),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.post = x;
      });

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStateisEditSuccessful),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.isEditPost = x ? false : true;
      });

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(userProfile),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.user = x;
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
  }

  ngOnInit(): void {
    if (!this.post) {
      this.store.dispatch(new GetPostAction({ id: this.postId }));
    }

    this.store.dispatch(new GetCommentsAction({ postId: this.postId }));
  }

  onEditPost() {
    this.isEditPost = !this.isEditPost;
    this.isAddComment = false;
  }

  onCancelPostEdit() {
    this.isEditPost = false;
    this.isAddComment = true;
    this.comment = null;
  }

  onCancelCommentEdit() {
    this.comment = null;
  }

  onEditComment(id: string) {
    this.isAddComment = this.isEditPost ? false : true;
    this.comment = this.comments.find(x => x.id === id);
  }
}
