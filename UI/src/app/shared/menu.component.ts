import { aboutRoute } from '../about/about.routing';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../auth/login.component';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { UserViewModel } from '../users/user-view-models';
import { shareReplay } from 'rxjs/operators';

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
  selector: 'gw-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  menuItems = MenuItems;
  user$: Observable<UserViewModel>;

  constructor(public dialog: MatDialog, private authService: AuthService) {
    this.user$ = this.authService.profile$.pipe(shareReplay());
  }

  openLoginDialog() {
    this.dialog.open(LoginComponent);
  }

  onLogout() {
    this.authService.logout();
  }
}
