import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { takeUntil, filter } from 'rxjs/operators';
import { authState, userProfile } from '../../store/auth/auth.selectors';
import { User, UserRole } from '../models/dto/user';
import { cloneDeep } from 'lodash';
import { MarkdownComponent } from 'ngx-markdown';
import { ActivatedRoute, Router } from '@angular/router';
import { usersProfileEditFullRoute } from '../users.routing';
import { GetUserAction } from '../../store/users/users.actions';
import { usersStateProfileUser } from '../../store/users/users.selectors';

export interface NavLink {
  label: string;
  link: string;
  index: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent extends BaseComponent implements OnInit {
  user: User;
  canEditProfile: boolean;
  navLinks: NavLink[] = [
    {
      label: 'Home',
      link: './',
      index: 0
    },
    {
      label: 'Posts',
      link: 'posts',
      index: 1
    },
    {
      label: 'Comments',
      link: 'comments',
      index: 2
    },
  ];
  activeLink = this.navLinks[0];

  constructor(
    private store: Store<AuthState>,
    private route: ActivatedRoute,
    private router: Router) {
    super();
    const userId = this.route.snapshot.params.id;

    if (this.router.url.includes('comments')) {
      this.activeLink = this.navLinks[2];
    } else if (this.router.url.includes('posts')) {
      this.activeLink = this.navLinks[1];
    }

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
