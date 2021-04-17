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
  OnInit,
} from '@angular/core';
import { BaseComponent } from '../shared/base.component';
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
import { PostContext, PostViewModel } from './models/home-view-model';
import { AddItem } from '../add-item/add-item.models';
import { ViewportScroller } from '@angular/common';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
})
export class PostsComponent extends BaseComponent implements OnInit, AfterViewInit {
  posts: PagedData<PostViewModel>;
  user: User;
  queryRequest: QueryRequest;
  postContext = PostContext;
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
    private postsService: PostsService
  ) {
    super();
    this.route.queryParams.subscribe(params => {
      this.queryRequest = new QueryRequest(params as QueryParams);
      this.postsService.filter = this.queryRequest?.filters;
      this.postsService.sort = this.queryRequest.sorting;

      if (this.sidebarNavigationType || this.queryRequest.fromPost) {
        // this.store.dispatch(new ClearPostsAction());
        this.loadPosts();
      }
    });

    store.pipe(takeUntil(this.destroyed$), select(userProfile)).subscribe(x => {
      this.user = x;
      this.addItem.userAvatar = this.user?.avatar;
    });

    // store
    //   .pipe(takeUntil(this.destroyed$), select(homeStatePosts))
    //   .subscribe(x => {
    //     this.posts = x;
    //     if (!this.posts && !this.sidebarNavigationType && !this.queryRequest.fromPost) {
    //       this.loadPosts();
    //     }
    //   });

    this.postsService.posts$.pipe(takeUntil(this.destroyed$)).subscribe(x => {
      this.posts = x;
    })

    store
      .pipe(takeUntil(this.destroyed$), select(homeStateSidebarNavigation))
      .subscribe(x => {
        this.sidebarNavigationType = x;
      });
  }

  ngOnInit(): void {
    this.postsService.getMany();
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
    this.postsService.getMany();
    // this.store.dispatch(
    //   new GetPostsAction({
    //     paging: {
    //       skip: this.posts ? this.posts.items.length : 0,
    //       take: this.environmentService.take,
    //     },
    //     filters: this.queryRequest?.filters,
    //     sorting: this.queryRequest.sorting,
    //   }),
    // );
  }
}
