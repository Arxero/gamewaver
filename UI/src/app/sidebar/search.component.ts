import { SidebarNavigation } from '../store/home/home.actions';
import { HomeState } from '../store/home/home.reducer';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SidebarNavigationType } from './sidebar-view.models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchTerm = new FormControl('');

  constructor(private router: Router, private store: Store<HomeState>) {}

  onSubmit() {
    this.store.dispatch(new SidebarNavigation({ sidebarNavigation: SidebarNavigationType.Search }));
    this.router.navigateByUrl(`?filters=content!like!${this.searchTerm.value}`);
  }

}
