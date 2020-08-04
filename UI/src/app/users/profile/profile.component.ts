import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { takeUntil, filter } from 'rxjs/operators';
import { authState, userProfile } from '../../store/auth/auth.selectors';
import { User, UserRole } from '../models/dto/user';
import { cloneDeep } from 'lodash';
import { MarkdownComponent } from 'ngx-markdown';
import {
  ActivatedRoute,
  Router,
  NavigationStart,
  RouterEvent,
} from '@angular/router';
import { usersProfileEditFullRoute } from '../users.routing';
import {
  GetUserAction,
  ClearProfileUserAction,
} from '../../store/users/users.actions';
import { usersStateProfileUser } from '../../store/users/users.selectors';
import { NavLink } from '../models/view/nav-link';
import { UserViewModel } from '../models/view/user-view-model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent extends BaseComponent implements OnInit {
  user: UserViewModel;
  canEditProfile = true;
  navLinks: NavLink[] = [
    {
      label: 'Home',
      link: './',
    },
    {
      label: 'Posts',
      link: 'posts',
    },
    {
      label: 'Comments',
      link: 'comments',
    },
  ];
  activeLink = this.navLinks[0];

  constructor(
    private store: Store<AuthState>,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {
    super();
    const userId = this.route.snapshot.params.id;

    if (this.router.url.includes('comments')) {
      this.activeLink = this.navLinks[2];
    } else if (this.router.url.includes('posts')) {
      this.activeLink = this.navLinks[1];
    }

    let loggedInUser: UserViewModel;
    // load user from profile page
    store
      .pipe(
        takeUntil(this.destroyed$),
        select(userProfile),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.user = cloneDeep(x);
        loggedInUser = x;
      });

    // when visiting user profile
    if (userId === this.user.id) {
      return;
    }

    this.store.dispatch(new GetUserAction({ id: userId }));

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(usersStateProfileUser),
        filter(x => !!x),
      )
      .subscribe(requestedUser => {
        this.user = cloneDeep(requestedUser);
        this.canEditProfile = loggedInUser.role === UserRole.ADMIN;
      });

    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        if (event.url.includes('/users/profile/') && !event.url.includes('/edit')) {
          location.go(event.url);
          window.location.reload();
        }
      });
  }

  ngOnInit(): void {}

  onDestroy() {
    this.store.dispatch(new ClearProfileUserAction());
  }
}
