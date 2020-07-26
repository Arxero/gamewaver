import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { PostViewModel } from '../../home/models/view/post-view-model';
import { User } from '../models/dto/user';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../../store/auth/auth.selectors';
import {
  homeStatePosts,
  homeStatePostComments,
} from '../../store/home/home.selectors';
import {
  GetPostsAction,
  ClearPostsAction,
  GetCommentsAction,
} from '../../store/home/home.actions';
import { DataFilter, SearchType } from '../../shared/models/common';
import {
  PostContext,
  UserActionOnPost,
} from '../../home/models/view/home-view-model';

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.scss'],
})
export class ProfilePostsComponent extends BaseComponent implements OnInit {
  posts: PostViewModel[] = [];
  user: User;
  take = 3;
  get postContext() {
    return PostContext;
  }
  postContextUrl: PostContext;
  userId: string;
  commentsLength = 0;

  constructor(
    private store: Store<HomeState>,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();
    this.userId = this.route.parent.snapshot.params.id;

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
        select(homeStatePosts),
        filter(x => !!x && x.length > 0),
      )
      .subscribe(x => {
        this.posts = x;
      });
  }

  ngOnInit(): void {
    this.getPosts(UserActionOnPost.Posted);
  }

  onScrollDown() {
    this.getPosts(UserActionOnPost.Posted);
  }

  onDestroy() {
    this.store.dispatch(new ClearPostsAction());
  }

  private getPosts(userActionOnPost?: UserActionOnPost) {
    const postsFilter = {
      fieldName: 'author',
      searchOperator: SearchType.In,
      searchValue: this.userId,
    };

    this.store.dispatch(
      new GetPostsAction({
        paging: { skip: this.posts.length, take: this.take },
        filters: [postsFilter],
        userActionOnPost,
      }),
    );
  }
}
