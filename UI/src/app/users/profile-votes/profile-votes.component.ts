import { homeStatePosts, homeStateVotedPosts } from './../../store/home/home.selectors';
import { userProfile } from './../../store/auth/auth.selectors';
import { takeUntil, filter } from 'rxjs/operators';
import { GetPostsAction, ClearPostsAction } from './../../store/home/home.actions';
import { SearchType } from './../../shared/models/common';
import { PostContext, UserActionOnPost } from './../../home/models/view/home-view-model';
import { User } from './../models/dto/user';
import { PostViewModel } from './../../home/models/view/post-view-model';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { HomeState } from './../../store/home/home.reducer';
import { BaseComponent } from './../../shared/base.component';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserViewModel } from '../models/view/user-view-model';

@Component({
  selector: 'app-profile-votes',
  templateUrl: './profile-votes.component.html',
  styleUrls: ['./profile-votes.component.scss']
})
export class ProfileVotesComponent extends BaseComponent implements OnInit {
  posts: PostViewModel[] = [];
  user$: Observable<UserViewModel>;
  take = 5;
  get postContext() {
    return PostContext;
  }
  postContextUrl: PostContext;
  userId: string;

  constructor(
    private store: Store<HomeState>,
    private route: ActivatedRoute,
  ) {
    super();
    this.userId = this.route.parent.snapshot.params.id;
    this.user$ = store.pipe(select(userProfile));

    store.pipe(
      takeUntil(this.destroyed$),
      select(homeStateVotedPosts),
      filter(x => !!x && x.length > 0),
    )
    .subscribe(x => this.posts = x);
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
    const postsFilter = {
      fieldName: 'votes',
      searchOperator: SearchType.In,
      searchValue: this.userId,
    };

    this.store.dispatch(
      new GetPostsAction({
        paging: { skip: this.posts.length, take: this.take },
        filters: [postsFilter],
        userActionOnPost,
      }),
    );
  }

}
