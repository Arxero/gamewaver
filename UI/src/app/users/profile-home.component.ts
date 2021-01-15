import { commentsStatePostComments } from '../store/comments/comments.selectors';
import { EnvironmentService } from '../services/environment.service';
import { dateSort } from '../shared/models/common';
import { Component, OnInit } from '@angular/core';
import { ProfileHomeItem } from './user-view-models';
import { User } from './user';
import {
  PostContext,
  UserActionOnPost,
} from '../home/models/home-view-model';
import { BaseComponent } from '../shared/base.component';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../store/home/home.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../store/auth/auth.selectors';
import {
  homeStatePosts,
  homeStateVotedPosts,
} from '../store/home/home.selectors';
import { SearchType } from '../shared/models/common';
import {
  GetPostsAction,
  ClearPostsAction,
} from '../store/home/home.actions';
import { PostViewModel } from '../home/models/post-view-model';
import { CommentViewModel } from '../home/models/comment-view-model';
import { combineLatest, Observable } from 'rxjs';
import * as lodash from 'lodash';
import { ClearCommentsAction, GetCommentsAction } from '../store/comments/comments.actions';

@Component({
  selector: 'app-profile-home',
  templateUrl: './profile-home.component.html',
})
export class ProfileHomeComponent extends BaseComponent implements OnInit {
  homeItems: ProfileHomeItem[] = [];
  user$: Observable<User>;
  userId: string;
  get postContext() {
    return PostContext;
  }

  posts: PostViewModel[] = [];
  comments: CommentViewModel[] = [];

  constructor(
    private store: Store<HomeState>,
    private route: ActivatedRoute,
    private environmentService: EnvironmentService,
  ) {
    super();
    this.user$ = store.pipe(select(userProfile));

    combineLatest([
      store.pipe(
        takeUntil(this.destroyed$),
        select(homeStatePosts),
        filter(x => !!x),
      ),
      store.pipe(
        takeUntil(this.destroyed$),
        select(commentsStatePostComments),
        filter(x => !!x),
      ),
      store.pipe(
        takeUntil(this.destroyed$),
        select(homeStateVotedPosts),
        filter(x => !!x && x.length > 0),
      ),
    ]).subscribe(items => {
      this.posts = items[0].items;
      this.comments = items[1].items;
      this.homeItems = [];

      items[0].items.forEach(x => {
        this.homeItems.push({ post: x, date: x.createdAt });
      });

      items[2].forEach(x => {
        this.homeItems.push({ post: x, date: x.voteCreated });
      });

      items[1].items.forEach(x =>
        this.homeItems.push({ comment: x, date: x.createdAt }),
      );
      this.homeItems = lodash.orderBy(this.homeItems, ['date'], 'desc');
    });

    this.route.params.subscribe(p => {
      this.userId = p.id;
      this.posts = [];
      this.comments = [];
      this.store.dispatch(new ClearPostsAction());
      this.getPosts(UserActionOnPost.Posted);
      this.getPosts(UserActionOnPost.Voted);
      this.getComments();
    });
  }

  ngOnInit(): void {}

  onScrollDown() {
    this.getPosts(UserActionOnPost.Posted);
    this.getPosts(UserActionOnPost.Voted);
    this.getComments();
  }

  onDestroy() {
    this.store.dispatch(new ClearPostsAction());
    this.store.dispatch(new ClearCommentsAction());
  }

  private getPosts(userActionOnPost?: UserActionOnPost) {
    const postsFilter = {
      fieldName:
        userActionOnPost === UserActionOnPost.Posted ? 'author' : 'votes',
      searchOperator: SearchType.In,
      searchValue: this.userId,
    };

    this.store.dispatch(
      new GetPostsAction({
        paging: { skip: this.posts.length, take: this.environmentService.take },
        filters: [postsFilter],
        userActionOnPost,
        sorting: [dateSort],
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
        paging: {
          skip: this.comments.length,
          take: this.environmentService.take,
        },
        filters: [commentsFilter],
      }),
    );
  }
}
