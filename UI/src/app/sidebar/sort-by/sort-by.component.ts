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
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { SidebarHelperService } from '../sidebar-helper.service';
import { takeUntil, filter } from 'rxjs/operators';
import { TypedChange } from '../../shared/models/common';

interface SortByComponentChanges extends SimpleChanges {
  sortType: TypedChange<SortType>;
  time: TypedChange<SortTime>;
}

@Component({
  selector: 'app-sort-by',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.scss'],
})
export class SortByComponent extends BaseComponent
  implements OnInit, OnChanges {
  items: SortSidebarItem[];
  sort: SortSidebarItem;

  @Input() sortType: SortType;
  @Input() time: SortTime;

  selectedTime = new FormControl(this.time);
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
    private ref: ChangeDetectorRef
  ) {
    super();
    this.items = sidebarHelper.sorts;
    this.sort = this.items[0];

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStateSidebarNavigation),
        filter(x => !!x && x !== SidebarNavigationType.Sort),
      )
      .subscribe(() => {
        this.selectedTime.setValue(SortTime.All);
        this.items.map(x => (x.class = ''));
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
    this.store.dispatch(
      new SidebarNavigation({ sidebarNavigation: SidebarNavigationType.Sort }),
    );

    if (!isTime) {
      return;
    }

    this.router.navigateByUrl(
      `?sort=${this.sort.url}${
        this.sidebarHelper.sortTimeMap[this.selectedTime.value]
      }`,
    );
  }
}
