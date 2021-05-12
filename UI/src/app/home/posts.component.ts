import { SidebarNavigation } from '../sidebar/sidebar-view.models';
import { Component, AfterViewInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { User } from '../users/user';
import { ActivatedRoute } from '@angular/router';
import { PostContext, PostViewModel } from './models/home-view-model';
import { AddItem } from '../add-item/add-item.models';
import { ViewportScroller } from '@angular/common';
import { PostsService } from './services/posts.service';
import { Observable } from 'rxjs';
import { SidebarNavigationService } from './services/sidebar-navigation.service';
import { ScrollPositionService } from './services/scroll-position.service';
import { AuthService } from '../auth/auth.service';
import { OnDestroyCleanup, PagedData, QueryRequest, QueryParams } from '@gamewaver/shared';

@Component({
  selector: 'gw-posts',
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
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private postsService: PostsService,
    private sidebarNavigation: SidebarNavigationService,
    private scrollPositionService: ScrollPositionService,
    private authService: AuthService,
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

    this.authService.profile$.pipe(takeUntil(this.destroyed$)).subscribe(x => {
      this.user = x;
      this.addItem.userAvatar = this.user?.avatar;
      this.addItem.userId = this.user?.id;
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
