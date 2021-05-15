import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { ActivatedRoute } from '@angular/router';
import { PostContext, UserActionOnPost, PostViewModel } from '../home/models/home-view-model';
import { Observable } from 'rxjs';
import { PostsService } from '../home/services/posts.service';
import { AuthService } from '../auth/auth.service';
import { PagedData, SearchType, SortDirection, OnDestroyCleanup } from '@gamewaver/shared';

export interface UrlProfileData {
  filterFieldName: string;
  sortPropName: string;
  userActionOnPost: UserActionOnPost;
}

@Component({
  selector: 'gw-profile-posts',
  templateUrl: './profile-posts.component.html',
})
export class ProfilePostsComponent extends OnDestroyCleanup implements OnInit {
  user$: Observable<User>;
  postContext = PostContext;
  posts$: Observable<PagedData<PostViewModel>>;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private authService: AuthService,
  ) {
    super();
    const userId = this.route.parent.snapshot.params.id;
    this.user$ = this.authService.profile$;

    route.data.subscribe((data: UrlProfileData) => {
      this.postsService.action = data.userActionOnPost;
      this.postsService.filter = [
        {
          fieldName: data.filterFieldName,
          searchOperator: SearchType.Equal,
          searchValue: userId,
        },
      ];

      this.postsService.sort = [
        {
          propertyName: data.sortPropName,
          sort: SortDirection.DESC,
        },
      ];
    });

    this.posts$ = this.postsService.posts$;
  }

  ngOnInit(): void {
    this.postsService.getMany();
  }

  onScrollDown(): void {
    this.postsService.getMany();
  }

  onDestroy(): void {
    this.postsService.clear();
  }
}
