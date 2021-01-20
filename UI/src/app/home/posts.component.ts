import { SidebarNavigationType } from '../sidebar/sidebar-view.models';
import {
  homeStateSidebarNavigation,
  homeScrollPosition,
} from '../store/home/home.selectors';
import { EnvironmentService } from '../services/environment.service';
import {
  dateSort,
  PagedData,
} from '../shared/models/common';
import {
  Component,
  AfterViewInit,
} from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { PostViewModel } from './models/post-view-model';
import { HomeState } from '../store/home/home.reducer';
import { Store, select } from '@ngrx/store';
import {
  GetPostsAction,
  ClearPostsAction,
} from '../store/home/home.actions';
import { takeUntil, filter } from 'rxjs/operators';
import { homeStatePosts } from '../store/home/home.selectors';
import { User } from '../users/user';
import { userProfile } from '../store/auth/auth.selectors';
import { ActivatedRoute } from '@angular/router';
import { QueryRequest, QueryParams } from '../shared/models/query-request';
import { PostContext } from './models/home-view-model';
import { AddItem } from './models/add-item';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
})
export class PostsComponent extends BaseComponent implements AfterViewInit {
  posts: PagedData<PostViewModel>;
  user: User;
  queryRequest: QueryRequest;
  get postContext() {
    return PostContext;
  }
  addItem: AddItem = {
    isPost: true,
    minLength: 3,
    maxLength: 5000,
  };

  sidebarNavigationType: SidebarNavigationType;

  constructor(
    private store: Store<HomeState>,
    private route: ActivatedRoute,
    private environmentService: EnvironmentService,
    private viewportScroller: ViewportScroller,
  ) {
    super();
    this.route.queryParams.subscribe(params => {
      this.queryRequest = new QueryRequest(params as QueryParams);
      this.queryRequest.sorting.push(dateSort);

      if (this.sidebarNavigationType || params?.fromPost) {
        this.store.dispatch(new ClearPostsAction());
        this.loadPosts();
      }
    });

    store.pipe(takeUntil(this.destroyed$), select(userProfile)).subscribe(x => {
      this.user = x;
      this.addItem.userAvatar = this.user?.avatar;
    });

    store
      .pipe(takeUntil(this.destroyed$), select(homeStatePosts))
      .subscribe(x => {
        this.posts = x;
        if (!this.posts && !this.sidebarNavigationType) {
          this.loadPosts();
        }
      });

    store
      .pipe(takeUntil(this.destroyed$), select(homeStateSidebarNavigation))
      .subscribe(x => {
        this.sidebarNavigationType = x;
      });
  }

  ngAfterViewInit(): void {
    this.store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeScrollPosition),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.viewportScroller.scrollToPosition(x);
      });
  }

  onScrollDown() {
    if (this.posts.total === this.posts.items.length) {
      return;
    }
    this.loadPosts();
  }

  private loadPosts() {
    this.store.dispatch(
      new GetPostsAction({
        paging: {
          skip: this.posts ? this.posts.items.length : 0,
          take: this.environmentService.take,
        },
        filters: this.queryRequest?.filters,
        sorting: this.queryRequest.sorting,
      }),
    );
  }
}
