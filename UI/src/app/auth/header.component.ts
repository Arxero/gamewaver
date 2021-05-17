import { SidebarNavigation } from '@gamewaver/sidebar';
import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LoadingService } from '@gamewaver/services';
import { timer, Observable } from 'rxjs';
import { distinctUntilChanged, delayWhen } from 'rxjs/operators';
import { SidebarNavigationService } from '@gamewaver/home/services';

@Component({
  selector: 'gw-header',
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
