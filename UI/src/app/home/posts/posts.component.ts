import { homeStatePostsTotal } from './../../store/home/home.selectors';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
} from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { PostViewModel } from '../models/view/post-view-model';
import { HomeState } from '../../store/home/home.reducer';
import { Store, select } from '@ngrx/store';
import {
  GetPostsAction,
  ClearPostsAction,
} from '../../store/home/home.actions';
import { takeUntil, filter } from 'rxjs/operators';
import { homeStatePosts } from '../../store/home/home.selectors';
import { User } from '../../users/models/dto/user';
import { userProfile } from '../../store/auth/auth.selectors';
import { cloneDeep } from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { DataFilter, SearchType } from '../../shared/models/common';
import { QueryRequest, QueryParams } from '../../shared/models/query-request';
import { PostContext } from '../models/view/home-view-model';
import { AddItem } from '../models/view/add-item';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent extends BaseComponent implements OnInit {
  posts: PostViewModel[] = [];
  total: number;
  user: User;
  take = 5;
  queryRequest: QueryRequest;
  get postContext() {
    return PostContext;
  }
  addItem: AddItem = {
    isPost: true,
    minLength: 3,
    maxLength: 5000,
  };

  constructor(private store: Store<HomeState>, private route: ActivatedRoute) {
    super();

    this.route.queryParams.subscribe(params => {
      this.queryRequest = new QueryRequest(params as QueryParams);
      this.store.dispatch(new ClearPostsAction());
      this.posts = [];
      this.store.dispatch(
        new GetPostsAction({
          paging: { skip: this.posts.length, take: this.take },
          filters: this.queryRequest?.filters,
        }),
      );
    });

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(userProfile),
        // filter(x => !!x),
      )
      .subscribe(x => {
        this.user = x;
        this.addItem.userAvatar = this.user?.avatar;
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

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStatePostsTotal),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.total = x;
      });
  }

  ngOnInit(): void {}

  onScrollDown() {
    if (this.total === this.posts.length) {
      return;
    }
    this.store.dispatch(
      new GetPostsAction({
        paging: { skip: this.posts.length, take: this.take },
        filters: this.queryRequest.filters,
      }),
    );
  }
}
