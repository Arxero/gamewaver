import { OnDestroyCleanup } from '@gamewaver/shared';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthApiService } from '@gamewaver/services';
import { Router, Scroll } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { AuthService } from '@gamewaver/auth';

@Component({
  selector: 'gw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent  extends OnDestroyCleanup implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;

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

  close(): void {
    this.sidenav.close();
  }
}
