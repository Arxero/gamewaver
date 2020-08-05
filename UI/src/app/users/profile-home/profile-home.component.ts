import { Component, OnInit } from '@angular/core';
import { ProfileHomeItem } from '../models/view/profile-home-item';
import { User } from '../models/dto/user';
import {
  PostContext,
  UserActionOnPost,
} from '../../home/models/view/home-view-model';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../../store/auth/auth.selectors';
import {
  homeStatePosts,
  homeStatePostComments,
} from '../../store/home/home.selectors';
import { SearchType } from '../../shared/models/common';
import {
  GetPostsAction,
  ClearPostsAction,
  GetCommentsAction,
  ClearPostAction,
} from '../../store/home/home.actions';
import { PostViewModel } from '../../home/models/view/post-view-model';
import { CommentViewModel } from '../../home/models/view/comment-view-model';
import { combineLatest } from 'rxjs';
import * as lodash from 'lodash';

@Component({
  selector: 'app-profile-home',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.scss'],
})
export class ProfileHomeComponent extends BaseComponent implements OnInit {
  homeItems: ProfileHomeItem[] = [];
  user: User;
  take = 3;
  userId: string;
  get postContext() {
    return PostContext;
  }

  posts: PostViewModel[] = [];
  comments: CommentViewModel[] = [];

  constructor(
    private store: Store<HomeState>,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(userProfile),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.user = x;
      });

    combineLatest([
      store.pipe(
        takeUntil(this.destroyed$),
        select(homeStatePosts),
        filter(x => !!x && x.length > 0),
      ),
      store.pipe(
        takeUntil(this.destroyed$),
        select(homeStatePostComments),
        filter(x => !!x && x.length > 0),
      ),
    ]).subscribe(items => {
      this.posts = items[0];
      this.comments = items[1];
      this.homeItems = [];
      items[0].forEach(x =>
        this.homeItems.push({ post: x, date: x.createdAt }),
      );
      items[1].forEach(x =>
        this.homeItems.push({ comment: x, date: x.createdAt }),
      );
      this.homeItems = lodash.orderBy(this.homeItems, ['date'], 'desc');
    });

    this.route.parent.params.subscribe(p => {
      this.userId = p.id;
      this.store.dispatch(new ClearPostsAction());
      this.getPosts(UserActionOnPost.Posted);
      this.getComments();
    });
  }

  ngOnInit(): void {}

  onScrollDown() {
    this.getPosts(UserActionOnPost.Posted);
    this.getComments();
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

  private getComments() {
    const commentsFilter = {
      fieldName: 'author',
      searchOperator: SearchType.Equal,
      searchValue: this.userId,
    };

    this.store.dispatch(
      new GetCommentsAction({
        paging: { skip: this.comments.length, take: this.take },
        filters: [commentsFilter],
      }),
    );
  }
}
