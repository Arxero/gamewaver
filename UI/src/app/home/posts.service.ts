import { BaseComponent } from './../shared/base.component';
import { Injectable, OnDestroy } from '@angular/core';
import { PostsApiService } from '../services/posts.api.service';
import { Subject } from 'rxjs';
import { PagedData } from '../shared/models/common';
import { PostViewModel } from './models';
import { SidebarNavigationType } from '../sidebar/sidebar-view.models';
import { AuthState } from '../store/auth/auth.reducer';
import { Store, select } from '@ngrx/store';
import { UserViewModel } from '../users/user-view-models';
import { withLatestFrom, take, takeUntil } from 'rxjs/operators';
import { userProfile } from '../store/auth/auth.selectors';

@Injectable()
export class PostsService extends BaseComponent implements OnDestroy {
  private _postsSubject = new Subject<PagedData<PostViewModel>>();
  private _post: PostViewModel;
  private _sidebarNavigation: SidebarNavigationType;
  private _user: UserViewModel;

  isEditSuccessful: boolean;
  scrollPosition: [number, number];

  constructor(private postsApiService: PostsApiService, private store: Store<AuthState>) {
    super();
    this.store.pipe(takeUntil(this.destroyed$), select(userProfile)).subscribe(x => {
      this._user = x;
    });
  }

}
