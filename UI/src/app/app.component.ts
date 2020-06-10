import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MenuItems } from './shared/menu/menu-items';
import { AuthService } from './shared/services/auth.service';
import { Store } from '@ngrx/store';
import { AuthState } from './store/auth/auth.reducer';
import { GetUserInfoAction } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  get menuItems() { return MenuItems; }

  constructor(
    private authService: AuthService,
    private store: Store<AuthState>) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.store.dispatch(new GetUserInfoAction());
    }
  }

  close() {
    this.sidenav.close();
  }

  onLogout() {

  }
}
