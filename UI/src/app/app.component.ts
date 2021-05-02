import { OnDestroyCleanup } from './shared/on-destory-cleanup';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthApiService } from './services/auth.api.service';
import { Router, Scroll } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { MenuItems } from './shared/menu.component';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent  extends OnDestroyCleanup implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  get menuItems() {
    return MenuItems;
  }

  constructor(
    private authApiService: AuthApiService,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private authService: AuthService,
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
    if (this.authApiService.isLoggedIn()) {
      this.authService.getProfile();
    }
  }

  close() {
    this.sidenav.close();
  }
}
