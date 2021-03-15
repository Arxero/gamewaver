import { EnvironmentService } from '../services/environment.service';
import { dateSort, PagedData } from '../shared/models/common';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { PostViewModel } from '../home/models/post-view-model';
import { User } from './user';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../store/home/home.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../store/auth/auth.selectors';
import { homeStatePosts } from '../store/home/home.selectors';
import {
  GetPostsAction,
  ClearPostsAction,
} from '../store/home/home.actions';
import { SearchType } from '../shared/models/common';
import {
  PostContext,
  UserActionOnPost,
} from '../home/models/home-view-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
})
export class ProfilePostsComponent extends BaseComponent implements OnInit {
  posts: PagedData<PostViewModel>;

  user$: Observable<User>;
  get postContext() {
    return PostContext;
  }
  postContextUrl: PostContext;
  userId: string;
  commentsLength = 0;

  constructor(
    private store: Store<HomeState>,
    private route: ActivatedRoute,
    private environmentService: EnvironmentService,
  ) {
    super();
    this.userId = this.route.parent.snapshot.params.id;
    this.user$ = store.pipe(select(userProfile));

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStatePosts),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.posts = x;
      });
  }

  ngOnInit(): void {
    this.getPosts();
  }

  onScrollDown() {
    if (this.posts.total === this.posts.items.length) {
      return;
    }
    this.getPosts();
  }

  onDestroy() {
    this.store.dispatch(new ClearPostsAction());
  }

  private getPosts() {
    const postsFilter = {
      fieldName: 'authorId',
      searchOperator: SearchType.Equal,
      searchValue: this.userId,
    };

    this.store.dispatch(
      new GetPostsAction({
        paging: { skip: this.posts?.items.length || 0, take: this.environmentService.take },
        filters: [postsFilter],
        userActionOnPost: UserActionOnPost.Posted,
        sorting: [dateSort],
      }),
    );
  }
}
