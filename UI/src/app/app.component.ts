import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MenuItems } from './shared/menu-items';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('sidenav') sidenav: MatSidenav;
  get menuItems() { return MenuItems; }

  close() {
    this.sidenav.close();
  }

  onLogout() {

  }
}
