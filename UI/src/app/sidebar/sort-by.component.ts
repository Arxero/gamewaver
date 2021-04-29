import { OnDestroyCleanup } from '../shared/on-destory-cleanup';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { SortTime, SidebarNavigation, SortSidebarItem, SortType } from './sidebar-view.models';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SidebarHelperService } from './sidebar-helper.service';
import { takeUntil, filter } from 'rxjs/operators';
import { TypedChange } from '../shared/models/common';
import { SidebarNavigationService } from '../home/services/sidebar-navigation.service';

interface SortByComponentChanges extends SimpleChanges {
  sortType: TypedChange<SortType>;
  time: TypedChange<SortTime>;
}

@Component({
  selector: 'app-sort-by',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.scss'],
})
export class SortByComponent extends OnDestroyCleanup implements OnInit, OnChanges {
  items: SortSidebarItem[];
  sort: SortSidebarItem;

  @Input() sortType: SortType;
  @Input() time: SortTime;

  selectedTime = new FormControl(this.time);
  sortTime: SortTime[] = [SortTime.Days1, SortTime.Days7, SortTime.Days30, SortTime.All];

  constructor(
    private router: Router,
    private sidebarHelper: SidebarHelperService,
    private sidebarNavigation: SidebarNavigationService,
  ) {
    super();
    this.items = sidebarHelper.sorts;
    this.sort = this.items[0];
    this.sidebarNavigation.navigation$
      .pipe(
        takeUntil(this.destroyed$),
        filter(x => x !== SidebarNavigation.Sort),
      )
      .subscribe(() => {
        this.selectedTime.setValue(SortTime.All);
        this.items.map(x => (x.class = ''));
      });

    this.sidebarHelper.postNavigated$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.items = sidebarHelper.sorts;
    });
  }

  ngOnChanges(changes: SortByComponentChanges): void {
    const sort = changes.sortType?.currentValue;
    const time = changes.time?.currentValue;

    if (sort) {
      const i = this.items.findIndex(x => x.sortType === sort);
      this.items[i].class = 'selected';
      this.sort = this.items[i];
    }

    if (time) {
      this.selectedTime.setValue(time);
    }
  }

  ngOnInit(): void {}

  onSortSelected(sort: SortSidebarItem) {
    this.items.map(x => (x.class = ''));
    sort.class = 'selected';
    this.sort = sort;
    this.selectedTime.setValue(SortTime.All);
    this.navigateSorting();
  }

  navigateSorting(isTime?: boolean) {
    this.sidebarNavigation.navigation = SidebarNavigation.Sort;

    if (!isTime) {
      return;
    }

    this.router.navigateByUrl(
      `?sort=${this.sort.url}${this.sidebarHelper.sortTimeMap[this.selectedTime.value]}`,
    );
  }
}
