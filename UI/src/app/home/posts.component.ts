import { SidebarNavigation } from '../sidebar/sidebar-view.models';
import { PagedData } from '../shared/models/common';
import { Component, AfterViewInit } from '@angular/core';
import { OnDestroyCleanup } from '../shared/on-destory-cleanup';
import { Store, select } from '@ngrx/store';
import { takeUntil, filter } from 'rxjs/operators';
import { User } from '../users/user';
import { userProfile } from '../store/auth/auth.selectors';
import { ActivatedRoute } from '@angular/router';
import { QueryRequest, QueryParams } from '../shared/models/query-request';
import { PostContext, PostViewModel } from './models/home-view-model';
import { AddItem } from '../add-item/add-item.models';
import { ViewportScroller } from '@angular/common';
import { PostsService } from './services/posts.service';
import { Observable } from 'rxjs';
import { SidebarNavigationService } from './services/sidebar-navigation.service';
import { AuthState } from '../store/auth/auth.reducer';
import { ScrollPositionService } from './services/scroll-position.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
})
export class PostsComponent extends OnDestroyCleanup implements AfterViewInit {
  posts$: Observable<PagedData<PostViewModel>>;
  posts: PagedData<PostViewModel>;
  user: User;
  queryRequest: QueryRequest;
  postContext = PostContext;
  addItem: AddItem = {
    isPost: true,
    minLength: 3,
    maxLength: 5000,
  };

  private sidebarNavigationType: SidebarNavigation;

  constructor(
    private store: Store<AuthState>,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private postsService: PostsService,
    private sidebarNavigation: SidebarNavigationService,
    private scrollPositionService: ScrollPositionService,
  ) {
    super();
    this.route.queryParams.subscribe(params => {
      this.queryRequest = new QueryRequest(params as QueryParams);
      this.postsService.filter = this.queryRequest?.filters;
      this.postsService.sort = this.queryRequest.sorting;

      if (this.sidebarNavigationType || this.queryRequest.fromPost) {
        this.postsService.clear();
      }

      if (!this.postsService.isPosts) {
        this.postsService.getMany();
      }
    });

    store.pipe(takeUntil(this.destroyed$), select(userProfile)).subscribe(x => {
      this.user = x;
      this.addItem.userAvatar = this.user?.avatar;
    });

    this.posts$ = this.postsService.posts$;
    this.sidebarNavigation.navigation$.pipe(takeUntil(this.destroyed$)).subscribe(x => {
      this.sidebarNavigationType = x;
    });
  }

  ngAfterViewInit(): void {
    this.scrollPositionService.scrollPosition$.pipe(takeUntil(this.destroyed$)).subscribe(x => {
      this.viewportScroller.scrollToPosition(x);
    });
  }

  onScrollDown() {
    this.postsService.getMany();
  }
}
