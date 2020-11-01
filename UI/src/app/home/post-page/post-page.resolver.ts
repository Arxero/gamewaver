import { AuthService } from './../../services/auth.service';
import { userProfile } from './../../store/auth/auth.selectors';
import { homeStatePostComments } from './../../store/home/home.selectors';
import { GetCommentsAction } from './../../store/home/home.actions';
import { CommentViewModel } from './../models/view/comment-view-model';
import { DataFilter, SearchType } from './../../shared/models/common';
import { EnvironmentService } from './../../services/environment.service';
import { HomeState } from './../../store/home/home.reducer';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { filter, map, take, tap } from 'rxjs/operators';
import { UserViewModel } from 'src/app/users/models/view/user-view-model';

export interface IPostPage {
  commentsFilters: DataFilter[];
  comments: CommentViewModel[];
  user: UserViewModel;
}

@Injectable({
  providedIn: 'root',
})
export class PostPageResolver implements Resolve<UserViewModel> {
  constructor(
    private store: Store<HomeState>,
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<UserViewModel> {

    return this.store
      .pipe(
        select(userProfile),
        take(1)
      );
  }
}
