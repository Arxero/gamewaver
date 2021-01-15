import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../shared/base.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../store/auth/auth.reducer';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../store/auth/auth.selectors';
import { UserRole } from './user';
import { cloneDeep } from 'lodash';
import { ActivatedRoute } from '@angular/router';
import {
  GetUserAction,
  ClearProfileUserAction,
} from '../store/users/users.actions';
import { usersStateProfileUser } from '../store/users/users.selectors';
import { NavLink, navLinks } from './user-view-models';
import { UserViewModel } from './user-view-models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends BaseComponent implements OnInit {
  user: UserViewModel;
  canEditProfile: boolean;
  activeLink: NavLink;
  get navLinks() {
    return navLinks;
  }

  constructor(private store: Store<AuthState>, private route: ActivatedRoute) {
    super();
    this.route.children[0].url.subscribe(url => {
      this.activeLink =
        navLinks.find(x => x.link === url[0]?.path) || navLinks[0];
    });

    this.route.params.subscribe(param => {
      const userId = param.id;
      let loggedInUser: UserViewModel;
      // load user from profile page
      this.store
        .pipe(
          takeUntil(this.destroyed$),
          select(userProfile),
          filter(x => !!x),
        )
        .subscribe(x => {
          this.user = cloneDeep(x);
          this.canEditProfile = true;
          loggedInUser = x;
        });

      // when visiting user own profile
      if (userId === this.user?.id) {
        return;
      }

      this.store.dispatch(new GetUserAction({ id: userId }));
      this.store
        .pipe(
          takeUntil(this.destroyed$),
          select(usersStateProfileUser),
          filter(x => !!x),
        )
        .subscribe(requestedUser => {
          this.user = cloneDeep(requestedUser);
          this.canEditProfile = loggedInUser?.role === UserRole.ADMIN;
        });
    });
  }

  ngOnInit(): void {}

  onDestroy() {
    this.store.dispatch(new ClearProfileUserAction());
  }
}
