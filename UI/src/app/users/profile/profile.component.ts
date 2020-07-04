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
import { usersInPosts } from '../../store/home/home.selectors';
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
  editProfileUrl = '../edit';
  canEditProfile: boolean;
  userId: string;

  constructor(private store: Store<AuthState>, private route: ActivatedRoute) {
    super();
    this.userId = this.route.snapshot.params.id;
    this.editProfileUrl = this.userId
      ? `../${this.editProfileUrl}/${this.userId}`
      : this.editProfileUrl;

    let loggedUser: User;
    // load user from profile page
    store
      .pipe(
        takeUntil(this.destroyed$),
        select(userProfile),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.user = this.userId ? null : cloneDeep(x);
        this.canEditProfile = true;
        loggedUser = x;
      });

    // when visiting user profile
    if (this.userId) {
      this.store.dispatch(new GetUserAction({ id: this.userId }));

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
            loggedUser.id === this.userId ||
            !this.userId
              ? true
              : false;
        });
    }
  }

  ngOnInit(): void {}
}
