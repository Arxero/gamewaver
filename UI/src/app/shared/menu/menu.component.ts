import { Component, OnInit } from '@angular/core';
import { MenuItems } from './menu-items';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../auth/login/login.component';
import { AuthService } from '../services/auth.service';
import { BaseComponent } from '../base.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { takeUntil, filter } from 'rxjs/operators';
import { authState } from '../../store/auth/auth.selectors';
import { Profile } from '../models/Profile';
import { LogoutAction } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends BaseComponent implements OnInit {
  get menuItems() { return MenuItems; }
  isLoggedIn: boolean;
  user: Profile;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private store: Store<AuthState>) {
      super();

      store.pipe(
        takeUntil(this.destroyed$),
        select(authState),
        filter(x => !!x)
      ).subscribe(x => {
        this.isLoggedIn = x.isAuthenticated;
        this.user = x.profile;
      });



     }

  ngOnInit(): void {
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginComponent);

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

  onLogout() {
    this.store.dispatch(new LogoutAction());
  }
}
