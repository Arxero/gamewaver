import { homeStateSidebarNavigation } from './../../store/home/home.selectors';
import { BaseComponent } from './../../shared/base.component';
import { SidebarNavigationType } from './../models/sidebar-view-model';
import { SidebarNavigation } from './../../store/home/home.actions';
import { SidebarHelperService } from './../sidebar-helper.service';
import { HomeState } from './../../store/home/home.reducer';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { CategorySidebarItem } from '../models/sidebar-view-model';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent extends BaseComponent implements OnInit {
  items: CategorySidebarItem[];

  constructor(
    private router: Router,
    private store: Store<HomeState>,
    private sidebarHelper: SidebarHelperService,
  ) {
    super();
    this.items = sidebarHelper.categories;

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStateSidebarNavigation),
        filter(x => x !== SidebarNavigationType.Category),
      )
      .subscribe(() => {
        this.items.map(x => (x.class = ''));
      });
  }

  ngOnInit(): void {}

  onNavigate(category: CategorySidebarItem) {
    this.items.map(x => (x.class = ''));
    category.class = 'selected';
    this.store.dispatch(
      new SidebarNavigation({
        sidebarNavigation: SidebarNavigationType.Category,
      }),
    );
    this.router.navigateByUrl(category.url);
  }
}
