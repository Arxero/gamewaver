import { takeUntil, filter } from 'rxjs/operators';
import { SidebarHelperService } from './sidebar-helper.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SidebarNavigation, SidebarItem } from './sidebar-view.models';
import { SidebarNavigationService } from '../home/services/sidebar-navigation.service';
import { TypedChange, OnDestroyCleanup } from '@gamewaver/shared';

interface ArchiveComponentChanges extends SimpleChanges {
  year: TypedChange<string>;
  month: TypedChange<string>;
}

@Component({
  selector: 'gw-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
})
export class ArchiveComponent extends OnDestroyCleanup implements OnChanges {
  @Input() year: SidebarItem;
  @Input() month: SidebarItem;
  currentYear: string;
  years: SidebarItem[];
  months: SidebarItem[];

  constructor(
    private sidebarHelper: SidebarHelperService,
    private sidebarNavigation: SidebarNavigationService,
  ) {
    super();
    this.currentYear = this.sidebarHelper.year;
    this.years = this.sidebarHelper.years;
    this.months = this.sidebarHelper.months;
    this.sidebarNavigation.navigation$
      .pipe(
        takeUntil(this.destroyed$),
        filter(x => x !== SidebarNavigation.Archive),
      )
      .subscribe(() => {
        this.clearSelection();
      });

    this.sidebarHelper.postNavigated$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
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

      if (i > -1) {
        this.months[i].class = 'month selected';
      }
    }
  }

  onNavigate(item: SidebarItem): void {
    this.clearSelection();
    item.class = item.class + ' selected';
    this.sidebarNavigation.navigation = SidebarNavigation.Archive;
  }

  private clearSelection(): void {
    this.years.map(x => (x.class = 'year'));
    this.months.map(x => (x.class = 'month'));
  }
}
