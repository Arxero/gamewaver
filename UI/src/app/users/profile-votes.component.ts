import { EnvironmentService } from '../services/environment.service';
import { homeStateVotedPosts } from '../store/home/home.selectors';
import { userProfile } from '../store/auth/auth.selectors';
import { takeUntil, filter } from 'rxjs/operators';
import { GetPostsAction, ClearPostsAction } from '../store/home/home.actions';
import { SearchType, Sorting, SortDirection } from '../shared/models/common';
import { PostContext, UserActionOnPost } from '../home/models/home-view-model';
import { PostViewModel } from '../home/models/post-view-model';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../store/home/home.reducer';
import { BaseComponent } from '../shared/base.component';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserViewModel } from './user-view-models';

@Component({
  selector: 'app-profile-votes',
  templateUrl: './profile-votes.component.html',
})
export class ProfileVotesComponent extends BaseComponent implements OnInit {
  posts: PostViewModel[] = [];
  user$: Observable<UserViewModel>;
  get postContext() {
    return PostContext;
  }
  postContextUrl: PostContext;
  userId: string;

  constructor(
    private store: Store<HomeState>,
    private route: ActivatedRoute,
    private environmentService: EnvironmentService,
  ) {
    super();
    this.userId = this.route.parent.snapshot.params.id;
    this.user$ = store.pipe(select(userProfile));

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStateVotedPosts),
        filter(x => !!x && x.length > 0),
      )
      .subscribe(x => (this.posts = x));
  }

  ngOnInit(): void {
    this.getPosts(UserActionOnPost.Voted);
  }

  onScrollDown() {
    this.getPosts(UserActionOnPost.Voted);
  }

  onDestroy() {
    this.store.dispatch(new ClearPostsAction());
  }

  private getPosts(userActionOnPost?: UserActionOnPost) {
    const filters = [
      {
        fieldName: 'userId',
        searchOperator: SearchType.Equal,
        searchValue: this.userId,
      },
    ];
    const sorting: Sorting[] = [
      {
        propertyName: 'voteCreated',
        sort: SortDirection.DESC,
      },
    ];

    this.store.dispatch(
      new GetPostsAction({
        paging: { skip: this.posts.length, take: this.environmentService.take },
        filters,
        userActionOnPost,
        sorting,
      }),
    );
  }
}
