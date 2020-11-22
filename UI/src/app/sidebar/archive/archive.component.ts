import { homeStateSidebarNavigation } from './../../store/home/home.selectors';
import { takeUntil, filter } from 'rxjs/operators';
import { BaseComponent } from './../../shared/base.component';
import {
  SidebarNavigationType,
  SidebarItem,
} from './../models/sidebar-view-model';
import { SidebarNavigation } from './../../store/home/home.actions';
import { SidebarHelperService } from './../sidebar-helper.service';
import { HomeState } from './../../store/home/home.reducer';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent extends BaseComponent implements OnInit {
  year: string;
  years: SidebarItem[];
  months: SidebarItem[];

  constructor(
    private router: Router,
    private store: Store<HomeState>,
    private sidebarHelper: SidebarHelperService,
  ) {
    super();
    this.year = this.sidebarHelper.year;
    this.years = this.sidebarHelper.years;
    this.months = this.sidebarHelper.months;

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStateSidebarNavigation),
        filter(x => x !== SidebarNavigationType.Archive),
      )
      .subscribe(() => {
        this.years.map(x => (x.class = 'year'));
        this.months.map(x => (x.class = 'month'));
      });
  }

  ngOnInit(): void {}

  onNavigate(item: SidebarItem) {
    this.years.map(x => (x.class = 'year'));
    this.months.map(x => (x.class = 'month'));
    item.class = item.class + ' selected';
    this.store.dispatch(
      new SidebarNavigation({
        sidebarNavigation: SidebarNavigationType.Archive,
      }),
    );
    this.router.navigateByUrl(item.url);
  }
}
