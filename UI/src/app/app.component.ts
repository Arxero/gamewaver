import { BaseComponent } from './shared/base.component';
import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './services/auth.service';
import { Store, select } from '@ngrx/store';
import { AuthState } from './store/auth/auth.reducer';
import { GetUserInfoAction } from './store/auth/auth.actions';
import { Router, NavigationEnd, Scroll } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { homeStatePosts } from './store/home/home.selectors';
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

  isPostsLoaded: boolean;
  constructor(
    private authService: AuthService,
    private store: Store<AuthState>,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    super();

    router.events.pipe(
      filter((e): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      if (e.position) {
        // backward navigation
        viewportScroller.scrollToPosition(e.position);
      } else if (e.anchor) {
        // anchor navigation
        viewportScroller.scrollToAnchor(e.anchor);
      } else {
        // forward navigation
        viewportScroller.scrollToPosition([0, 0]);
      }
    });

    store
      .pipe(takeUntil(this.destroyed$), select(homeStatePosts))
      .subscribe(x => {
        if (x) {
          this.isPostsLoaded = true;
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
