import { ProfileBase } from './profile.base';
import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { NavLink, navLinks } from './user-view-models';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { UserInfo, UserInfoContext } from '../shared/user-info.component';

@Component({
  selector: 'gw-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends ProfileBase {
  activeLink: NavLink;
  navLinks = navLinks;
  userInfoContext = UserInfoContext;

  constructor(route: ActivatedRoute, usersService: UsersService, authService: AuthService) {
    super(route, usersService, authService);
    route.children[0].url.subscribe(url => {
      this.activeLink = navLinks.find(x => x.link === url[0]?.path) || navLinks[0];
    });

    this.usersService.user$.pipe(takeUntil(this.destroyed$)).subscribe(u => {
      this.user = u;
    });
  }

  get userInfo(): UserInfo {
    return {
      id: this.user.id,
      avatar: this.user.avatar,
      username: this.user.username,
      role: this.user.userRole,
      joinedAt: this.user.joinedAt
    }
  }
}
