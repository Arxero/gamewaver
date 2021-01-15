import { aboutRoute } from '../about/about.routing';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../auth/login.component';
import { BaseComponent } from './base.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../store/auth/auth.reducer';
import { takeUntil, filter } from 'rxjs/operators';
import { authState } from '../store/auth/auth.selectors';
import { User } from '../users/user';
import { LogoutAction } from '../store/auth/auth.actions';

export interface Menu {
  path: string;
  name: string;
  icon: string;
  route: string;
  children: Menu[];
}

export const MenuItems: Menu[] = [
  {
    name: 'about',
    route: aboutRoute,
    children: [
      { path: 'faq', name: 'faq' },
      { path: 'team', name: 'team' },
      { path: 'tos', name: 'tos' },
    ],
  } as Menu,
];

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent extends BaseComponent {
  get menuItems() { return MenuItems; }
  isLoggedIn: boolean;
  user: User;

  constructor(public dialog: MatDialog, private store: Store<AuthState>) {
    super();

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(authState),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.isLoggedIn = x.isAuthenticated;
        this.user = x.profile;
      });
  }

  openLoginDialog() {
    this.dialog.open(LoginComponent);
  }

  onLogout() {
    this.store.dispatch(new LogoutAction());
  }
}
