import { Component, OnInit, Input } from '@angular/core';
import { MenuItems } from '../menu/menu-items';
import { MatSidenav } from '@angular/material/sidenav';
import { LoadingService } from '../../services/loading.service';
import { timer, Observable } from 'rxjs';
import { distinctUntilChanged, delayWhen } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() sidenav: MatSidenav;
  isAuthenticated: boolean;
  loadingBarVisible$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    // delay for users to notice it
    this.loadingBarVisible$ = loadingService.uiLoading$.pipe(
      distinctUntilChanged(),
      delayWhen(loading => timer(loading ? 0 : 500))
    );
   }

  ngOnInit(): void {
  }

  onLogout() {

  }

}
