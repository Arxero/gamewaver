import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { SidebarNavigation } from './sidebar-view.models';
import { SidebarNavigationService } from '../home/services/sidebar-navigation.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchTerm = new FormControl('');

  constructor(
    private router: Router,
    private sidebarNavigation: SidebarNavigationService,
  ) {}

  onSubmit() {
    this.sidebarNavigation.navigation = SidebarNavigation.Search;
    this.router.navigateByUrl(`?filters=content!like!${this.searchTerm.value}`);
  }
}
