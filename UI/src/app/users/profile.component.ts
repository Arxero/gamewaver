import { ProfileBase } from './profile.base';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from '../store/auth/auth.reducer';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { NavLink, navLinks } from './user-view-models';
import { UsersService } from './users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends ProfileBase {
  activeLink: NavLink;
  navLinks = navLinks;

  constructor(store: Store<AuthState>, route: ActivatedRoute, usersService: UsersService) {
    super(store, route, usersService);
    route.children[0].url.subscribe(url => {
      this.activeLink = navLinks.find(x => x.link === url[0]?.path) || navLinks[0];
    });

    this.usersService.user$.pipe(takeUntil(this.destroyed$)).subscribe(u => {
      this.user = u;
    });
  }
}
