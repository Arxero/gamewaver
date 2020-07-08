import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../shared/base.component';
import { PostViewModel } from '../models/view/post-view-model';
import { takeUntil, filter } from 'rxjs/operators';
import {
  homeStatePosts,
  usersInPosts,
  homeStatePost,
  homeStateisEditSuccessful,
} from '../../store/home/home.selectors';
import { GetPostAction } from '../../store/home/home.actions';
import { User } from '../../users/models/dto/user';
import { userProfile } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
})
export class PostPageComponent extends BaseComponent implements OnInit {
  post: PostViewModel;
  user: User;
  postId: string;
  isEdit: boolean;
  isAddComment: boolean;

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
        this.isEdit = x ? false : true;
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
  }

  ngOnInit(): void {
    if (!this.post) {
      this.store.dispatch(new GetPostAction({ id: this.postId }));
    }
  }

  onEditPost() {
    this.isEdit = !this.isEdit;
  }

  onCancel() {
    this.isEdit = false;
  }

  onAddComment(value: boolean) {
    this.isAddComment = value;
  }
}
