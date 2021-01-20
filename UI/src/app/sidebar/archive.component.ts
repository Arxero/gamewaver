import { TypedChange } from '../shared/models/common';
import { homeStateSidebarNavigation } from '../store/home/home.selectors';
import { takeUntil, filter } from 'rxjs/operators';
import { BaseComponent } from '../shared/base.component';
import { SidebarNavigation } from '../store/home/home.actions';
import { SidebarHelperService } from './sidebar-helper.service';
import { HomeState } from '../store/home/home.reducer';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { SidebarNavigationType, SidebarItem } from './sidebar-view.models';

interface ArchiveComponentChanges extends SimpleChanges {
  year: TypedChange<string>;
  month: TypedChange<string>;
}

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent extends BaseComponent
  implements OnInit, OnChanges {
  currentYear: string;
  years: SidebarItem[];
  months: SidebarItem[];
  @Input() year: SidebarItem;
  @Input() month: SidebarItem;

  constructor(
    private router: Router,
    private store: Store<HomeState>,
    private sidebarHelper: SidebarHelperService,
  ) {
    super();
    this.currentYear = this.sidebarHelper.year;
    this.years = this.sidebarHelper.years;
    this.months = this.sidebarHelper.months;

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStateSidebarNavigation),
        filter(x => !!x && x !== SidebarNavigationType.Archive),
      )
      .subscribe(() => {
        this.clearSelection();
      });

    this.sidebarHelper.postNavigated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.currentYear = this.sidebarHelper.year;
        this.years = this.sidebarHelper.years;
        this.months = this.sidebarHelper.months;
      });
  }

  ngOnChanges(changes: ArchiveComponentChanges): void {
    const year = changes?.year?.currentValue;
    const month = changes?.month?.currentValue;
    this.clearSelection();

    if (year) {
      const i = this.years.findIndex(x => x.label === year);
      this.years[i].class = 'year selected';
    }

    if (month) {
      const i = this.months.findIndex(x => x.label === month);
      this.months[i].class = 'month selected';
    }
  }

  ngOnInit(): void {}

  onNavigate(item: SidebarItem) {
    this.clearSelection();
    item.class = item.class + ' selected';
    this.store.dispatch(
      new SidebarNavigation({
        sidebarNavigation: SidebarNavigationType.Archive,
      }),
    );
  }

  private clearSelection(): void {
    this.years.map(x => (x.class = 'year'));
    this.months.map(x => (x.class = 'month'));
  }
}
