import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { takeUntil, filter } from 'rxjs/operators';
import { authState, userProfile } from '../../store/auth/auth.selectors';
import { User, UserRole } from '../models/dto/user';
import { cloneDeep } from 'lodash';
import { MarkdownComponent } from 'ngx-markdown';
import { ActivatedRoute } from '@angular/router';
import { usersProfileEditFullRoute } from '../users.routing';
import { GetUserAction } from '../../store/users/users.actions';
import { usersStateProfileUser } from '../../store/users/users.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends BaseComponent implements OnInit {
  user: User;
  canEditProfile: boolean;

  constructor(private store: Store<AuthState>, private route: ActivatedRoute) {
    super();
    const userId = this.route.snapshot.params.id;

    let loggedUser: User;
    // load user from profile page
    store
      .pipe(
        takeUntil(this.destroyed$),
        select(userProfile),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.user = userId ? null : cloneDeep(x);
        this.canEditProfile = true;
        loggedUser = x;
      });

    // when visiting user profile
    if (userId) {
      this.store.dispatch(new GetUserAction({ id: userId }));

      store
        .pipe(
          takeUntil(this.destroyed$),
          select(usersStateProfileUser),
          filter(x => !!x),
        )
        .subscribe(x => {
          this.user = cloneDeep(x);
          this.canEditProfile =
            loggedUser.role === UserRole.ADMIN ||
            loggedUser.id === userId ||
            !userId
              ? true
              : false;
        });
    }
  }

  ngOnInit(): void {}
}
