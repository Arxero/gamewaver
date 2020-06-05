import { Component, OnInit, Input } from '@angular/core';
import { MenuItems } from '../menu/menu-items';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() sidenav: MatSidenav;
  isAuthenticated: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onLogout() {

  }

}
