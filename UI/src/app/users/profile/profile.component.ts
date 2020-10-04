import {
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../../store/auth/auth.selectors';
import { UserRole } from '../models/dto/user';
import { cloneDeep } from 'lodash';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  GetUserAction,
  ClearProfileUserAction,
} from '../../store/users/users.actions';
import { usersStateProfileUser } from '../../store/users/users.selectors';
import { NavLink } from '../models/view/nav-link';
import { UserViewModel } from '../models/view/user-view-model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent extends BaseComponent implements OnInit {
  user: UserViewModel;
  canEditProfile: boolean;
  activeLink: NavLink;
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
    {
      label: 'Votes',
      link: 'votes',
    },
  ];

  constructor(
    private store: Store<AuthState>,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();

    if (this.router.url.includes('comments')) {
      this.activeLink = this.navLinks[2];
    } else if (this.router.url.includes('posts')) {
      this.activeLink = this.navLinks[1];
    }

    this.route.params.subscribe(param => {
      const userId = param.id;
      this.activeLink = this.navLinks[0];

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

      // when visiting user profile
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
