import { CommentViewModel, PostViewModel } from './models/home-view-model';
import { DataFilter } from '../shared/models/common';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { UserViewModel } from 'src/app/users/user-view-models';
import { PostsService } from './services/posts.service';

export interface IPostPage {
  commentsFilters: DataFilter[];
  comments: CommentViewModel[];
  user: UserViewModel;
}

@Injectable()
export class PostPageResolver implements Resolve<PostViewModel> {
  constructor(private postsService: PostsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PostViewModel> {
    this.postsService.getOne(route.params.id);
    return this.postsService.post$.pipe(filter(x => !!x), take(1));
  }
}
