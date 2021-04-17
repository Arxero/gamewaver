import { EnvironmentService } from '../services/environment.service';
import {
  dateSort,
  PagedData,
  DataFilter,
  Sorting,
  SortDirection,
} from '../shared/models/common';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { User } from './user';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../store/home/home.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../store/auth/auth.selectors';
import { homeStatePosts } from '../store/home/home.selectors';
import { GetPostsAction, ClearPostsAction } from '../store/home/home.actions';
import { SearchType } from '../shared/models/common';
import { PostContext, UserActionOnPost, PostViewModel } from '../home/models/home-view-model';
import { Observable } from 'rxjs';

export interface UrlProfileData {
  filterFieldName: string;
  sortPropName: string;
  userActionOnPost: UserActionOnPost;
}

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
})
export class ProfilePostsComponent extends BaseComponent implements OnInit {
  posts: PagedData<PostViewModel>;
  user$: Observable<User>;
  postContext = PostContext;
  filter: DataFilter;
  sort: Sorting;
  userActionOnPost: UserActionOnPost;

  constructor(
    private store: Store<HomeState>,
    private route: ActivatedRoute,
    private environmentService: EnvironmentService,
  ) {
    super();
    const userId = this.route.parent.snapshot.params.id;
    this.user$ = store.pipe(select(userProfile));

    route.data.subscribe((data: UrlProfileData) => {
      this.filter = {
        fieldName: data.filterFieldName,
        searchOperator: SearchType.Equal,
        searchValue: userId,
      };

      this.sort = {
        propertyName: data.sortPropName,
        sort: SortDirection.DESC,
      };
      this.userActionOnPost = data.userActionOnPost;
    });

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
    if (this.posts) {
      this.store.dispatch(new ClearPostsAction());
      this.posts = null;
    }
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
    this.store.dispatch(
      new GetPostsAction({
        paging: {
          skip: this.posts?.items.length || 0,
          take: this.environmentService.take,
        },
        filters: [this.filter],
        userActionOnPost: this.userActionOnPost,
        sorting: [this.sort],
      }),
    );
  }
}
