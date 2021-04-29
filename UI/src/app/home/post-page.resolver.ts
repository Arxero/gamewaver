import { CommentViewModel } from './models/home-view-model';
import { userProfile } from '../store/auth/auth.selectors';
import { DataFilter } from '../shared/models/common';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { UserViewModel } from 'src/app/users/user-view-models';
import { AuthState } from '../store/auth/auth.reducer';

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
    private store: Store<AuthState>,
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
