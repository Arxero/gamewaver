import { homeStateSidebarNavigation } from './../../store/home/home.selectors';
import { BaseComponent } from './../../shared/base.component';
import { SidebarNavigation } from './../../store/home/home.actions';
import { HomeState } from './../../store/home/home.reducer';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import {
  SortTime,
  SortUrl,
  SidebarNavigationType,
  SortSidebarItem,
  SortType,
} from './../models/sidebar-view-model';
import { Component, OnInit, Input } from '@angular/core';
import { SidebarHelperService } from '../sidebar-helper.service';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-sort-by',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.scss'],
})
export class SortByComponent extends BaseComponent implements OnInit {
  items: SortSidebarItem[];
  @Input() sort: SortSidebarItem;
  selectedTime = new FormControl(SortTime.All);

  sortTime: SortTime[] = [
    SortTime.Days1,
    SortTime.Days7,
    SortTime.Days30,
    SortTime.All,
  ];

  constructor(
    private router: Router,
    private store: Store<HomeState>,
    private sidebarHelper: SidebarHelperService,
  ) {
    super();
    this.items = sidebarHelper.sorts;
    this.sort = this.items[0];

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStateSidebarNavigation),
        filter(x => x !== SidebarNavigationType.Sort),
      )
      .subscribe(() => {
        this.selectedTime.setValue(SortTime.All);
        this.items.map(x => (x.class = ''));
      });
  }

  ngOnInit(): void {
  }

  onSortSelected(sort: SortSidebarItem) {
    this.items.map(x => (x.class = ''));
    sort.class = 'selected';
    this.sort = sort;
    this.navigateSorting();
  }

  navigateSorting() {
    this.store.dispatch(
      new SidebarNavigation({ sidebarNavigation: SidebarNavigationType.Sort }),
    );

    this.router.navigateByUrl(
      `${this.sort.url}${
        this.sidebarHelper.sortTimeMap[this.selectedTime.value]
      }`,
    );
  }
}
