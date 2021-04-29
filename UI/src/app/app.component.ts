import { BaseComponent } from './shared/base.component';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './services/auth.service';
import { Store } from '@ngrx/store';
import { AuthState } from './store/auth/auth.reducer';
import { GetUserInfoAction } from './store/auth/auth.actions';
import { Router, Scroll } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { MenuItems } from './shared/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent  extends BaseComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  get menuItems() {
    return MenuItems;
  }

  constructor(
    private authService: AuthService,
    private store: Store<AuthState>,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    super();

    this.router.events.pipe(
      filter((e): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      if (e.position) {
        // backward navigation
        this.viewportScroller.scrollToPosition(e.position);
      } else if (e.anchor) {
        // anchor navigation
        this.viewportScroller.scrollToAnchor(e.anchor);
      } else {
        // forward navigation
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.store.dispatch(new GetUserInfoAction());
    }
  }

  close() {
    this.sidenav.close();
  }
}
