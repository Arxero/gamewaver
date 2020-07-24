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
  GetCommentsAction,
} from '../../store/home/home.actions';
import { DataFilter, SearchType } from '../../shared/models/common';
import { PostContext } from '../../home/models/view/home-view-model';

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.scss'],
})
export class ProfilePostsComponent extends BaseComponent implements OnInit {
  posts: PostViewModel[] = [];
  user: User;
  take = 3;
  get postContext() {
    return PostContext;
  }
  postsfilters: DataFilter[] = [];
  commentsFilters: DataFilter[] = [];
  postContextUrl: PostContext;

  constructor(
    private store: Store<HomeState>,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();
    this.setFilters(this.route.parent.snapshot.params.id);
    this.setPostContextUrl(this.router.url);

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
    this.loadData();
  }

  onScrollDown() {
    this.loadData();
  }

  onDestroy() {
    this.store.dispatch(new ClearPostsAction());
  }

  private setFilters(id: string) {
    this.postsfilters.push({
      fieldName: 'author',
      searchOperator: SearchType.In,
      searchValue: id,
    });

    this.commentsFilters.push({
      fieldName: 'author',
      searchOperator: SearchType.Equal,
      searchValue: id,
    });
  }

  private setPostContextUrl(url: string) {
    if (url.includes('posts')) {
      this.postContextUrl = PostContext.ProfilePagePosts;
    } else if (url.includes('comments')) {
      this.postContextUrl = PostContext.ProfilePageComments;
    } else {
      this.postContextUrl = PostContext.ProfilePageHome;
    }
  }

  private getPosts() {
    this.store.dispatch(
      new GetPostsAction({
        paging: { skip: this.posts.length, take: this.take },
        filters: this.postsfilters,
      }),
    );
  }

  private getComments() {
    this.store.dispatch(
      new GetCommentsAction({
        paging: { skip: 0, take: this.take },
        filters: this.commentsFilters,
      }),
    );
  }

  private loadData() {
    switch (this.postContextUrl) {
      case PostContext.ProfilePagePosts:
        this.getPosts();
        break;
      case PostContext.ProfilePageComments:
        this.getComments();
        break;
      case PostContext.ProfilePageHome:
        this.getPosts();
        this.getComments();
        break;
    }
  }
}
