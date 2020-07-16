import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { PostViewModel } from '../models/view/post-view-model';
import { HomeState } from '../../store/home/home.reducer';
import { Store, select } from '@ngrx/store';
import { GetPostsAction, ClearPostsAction } from '../../store/home/home.actions';
import { takeUntil, filter } from 'rxjs/operators';
import { homeStatePosts } from '../../store/home/home.selectors';
import { User } from '../../users/models/dto/user';
import { userProfile } from '../../store/auth/auth.selectors';
import { cloneDeep } from 'lodash';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent extends BaseComponent implements OnInit {
  posts: PostViewModel[] = [];
  user: User;
  take = 3;

  constructor(private store: Store<HomeState>, private route: ActivatedRoute) {
    super();

    this.route.queryParams.subscribe(params => {
      console.log(params);
    });

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(userProfile),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.user = x;
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
  }

  ngOnInit(): void {
    this.store.dispatch(new GetPostsAction({ paging: { skip: this.posts.length, take: this.take } }));
  }

  onScrollDown() {
    this.store.dispatch(new GetPostsAction({ paging: { skip: this.posts.length, take: this.take } }));
  }

  onDestroy() {
    this.store.dispatch(new ClearPostsAction());
  }
}
