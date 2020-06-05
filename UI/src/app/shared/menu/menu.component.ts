import { Component, OnInit } from '@angular/core';
import { MenuItems } from './menu-items';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  get menuItems() { return MenuItems; }


  constructor() { }

  ngOnInit(): void {
  }

}
