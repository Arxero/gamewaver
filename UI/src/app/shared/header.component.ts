import { SidebarNavigation } from '../sidebar/sidebar-view.models';
import { SidebarNavigationAction } from '../store/home/home.actions';
import { HomeState } from '../store/home/home.reducer';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LoadingService } from '../services/loading.service';
import { timer, Observable } from 'rxjs';
import { distinctUntilChanged, delayWhen } from 'rxjs/operators';
import { SidebarNavigationService } from '../home/services/sidebar-navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() sidenav: MatSidenav;
  loadingBarVisible$: Observable<boolean>;

  constructor(
    private loadingService: LoadingService,
    private sidebarNavigation: SidebarNavigationService,
  ) {
    // delay for users to notice it
    this.loadingBarVisible$ = this.loadingService.uiLoading$.pipe(
      distinctUntilChanged(),
      delayWhen(loading => timer(loading ? 0 : 500)),
    );
  }

  onNavigate(): void {
    this.sidebarNavigation.navigation = SidebarNavigation.Logo;
  }
}
