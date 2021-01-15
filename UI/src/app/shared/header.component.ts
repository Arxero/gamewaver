import { SidebarNavigationType } from '../sidebar/sidebar-view.models';
import { SidebarNavigation } from '../store/home/home.actions';
import { HomeState } from '../store/home/home.reducer';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LoadingService } from '../services/loading.service';
import { timer, Observable } from 'rxjs';
import { distinctUntilChanged, delayWhen } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() sidenav: MatSidenav;
  isAuthenticated: boolean;
  loadingBarVisible$: Observable<boolean>;

  constructor(
    private loadingService: LoadingService,
    private store: Store<HomeState>,
  ) {
    // delay for users to notice it
    this.loadingBarVisible$ = loadingService.uiLoading$.pipe(
      distinctUntilChanged(),
      delayWhen(loading => timer(loading ? 0 : 500)),
    );
  }

  ngOnInit(): void {}

  onLogout() {}

  onNavigate(): void {
    this.store.dispatch(
      new SidebarNavigation({
        sidebarNavigation: SidebarNavigationType.Logo,
      }),
    );
  }
}
