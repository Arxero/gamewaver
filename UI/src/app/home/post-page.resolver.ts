import { CommentViewModel, PostViewModel } from './models/home-view-model';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { UserViewModel } from '@gamewaver/users';
import { PostsService } from './services/posts.service';
import { DataFilter } from '@gamewaver/shared';

export interface IPostPage {
  commentsFilters: DataFilter[];
  comments: CommentViewModel[];
  user: UserViewModel;
}

@Injectable()
export class PostPageResolver implements Resolve<PostViewModel> {
  constructor(private postsService: PostsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PostViewModel> {
    this.postsService.getOne(route.params.id);
    return this.postsService.post$.pipe(filter(x => !!x), take(1));
  }
}
