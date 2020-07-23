import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { PostViewModel } from '../../home/models/view/post-view-model';
import { User } from '../models/dto/user';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../../store/home/home.reducer';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../../store/auth/auth.selectors';
import { homeStatePosts } from '../../store/home/home.selectors';
import { GetPostsAction, ClearPostsAction } from '../../store/home/home.actions';
import { DataFilter, SearchType } from '../../shared/models/common';
import { PostContext } from '../../home/models/view/post-context';

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.scss']
})
export class ProfilePostsComponent extends BaseComponent implements OnInit {
  posts: PostViewModel[] = [];
  user: User;
  take = 3;
  filters: DataFilter[] = [];
  get postContext() {
    return PostContext;
  }

  constructor(private store: Store<HomeState>, private route: ActivatedRoute) {
    super();

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(userProfile),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.user = x;
        this.filters.push({
          fieldName: 'author',
          searchOperator: SearchType.In,
          searchValue: this.user.id
        });

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
    this.store.dispatch(
      new GetPostsAction({
        paging: { skip: this.posts.length, take: this.take },
        filters: this.filters
      }),
    );
  }

  onScrollDown() {
    this.store.dispatch(
      new GetPostsAction({
        paging: { skip: this.posts.length, take: this.take },
        filters: this.filters
      }),
    );
  }

  onDestroy() {
    this.store.dispatch(new ClearPostsAction());
  }

}
