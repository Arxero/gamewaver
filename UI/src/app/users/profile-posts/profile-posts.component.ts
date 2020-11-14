import { EnvironmentService } from './../../services/environment.service';
import { Sorting, SortDirection, dateSort } from './../../shared/models/common';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { PostViewModel } from '../../home/models/view/post-view-model';
import { User } from '../models/dto/user';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../../store/auth/auth.selectors';
import { homeStatePosts } from '../../store/home/home.selectors';
import {
  GetPostsAction,
  ClearPostsAction,
} from '../../store/home/home.actions';
import { DataFilter, SearchType } from '../../shared/models/common';
import {
  PostContext,
  UserActionOnPost,
} from '../../home/models/view/home-view-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.scss'],
})
export class ProfilePostsComponent extends BaseComponent implements OnInit {
  posts: PostViewModel[] = [];
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
    private router: Router,
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
        this.posts = x.items;
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
        paging: { skip: this.posts.length, take: this.environmentService.take },
        filters: [postsFilter],
        userActionOnPost,
        sorting: [dateSort],
      }),
    );
  }
}
