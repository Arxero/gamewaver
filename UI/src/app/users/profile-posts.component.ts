import {
  PagedData,
  SortDirection,
} from '../shared/models/common';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { User } from './user';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { userProfile } from '../store/auth/auth.selectors';
import { SearchType } from '../shared/models/common';
import { PostContext, UserActionOnPost, PostViewModel } from '../home/models/home-view-model';
import { Observable } from 'rxjs';
import { PostsService } from '../home/services/posts.service';
import { AuthState } from '../store/auth/auth.reducer';

export interface UrlProfileData {
  filterFieldName: string;
  sortPropName: string;
  userActionOnPost: UserActionOnPost;
}

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
})
export class ProfilePostsComponent extends BaseComponent implements OnInit {
  user$: Observable<User>;
  postContext = PostContext;
  posts$: Observable<PagedData<PostViewModel>>;

  constructor(
    store: Store<AuthState>,
    private route: ActivatedRoute,
    private postsService: PostsService,
  ) {
    super();
    const userId = this.route.parent.snapshot.params.id;
    this.user$ = store.pipe(select(userProfile));

    route.data.subscribe((data: UrlProfileData) => {
      this.postsService.action = data.userActionOnPost;
      this.postsService.filter = [{
        fieldName: data.filterFieldName,
        searchOperator: SearchType.Equal,
        searchValue: userId
      }]

      this.postsService.sort = [{
        propertyName: data.sortPropName,
        sort: SortDirection.DESC,
      }]
    });

    this.posts$ = this.postsService.posts$;
  }

  ngOnInit(): void {
    this.postsService.getMany();
  }

  onScrollDown() {
    this.postsService.getMany();
  }

  onDestroy() {
    this.postsService.clear();
  }
}
