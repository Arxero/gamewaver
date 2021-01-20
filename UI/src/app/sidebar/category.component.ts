import { PostCategory } from '../home/models/post-category';
import { homeStateSidebarNavigation } from '../store/home/home.selectors';
import { BaseComponent } from '../shared/base.component';
import { SidebarNavigationType } from './sidebar-view.models';
import { SidebarNavigation } from '../store/home/home.actions';
import { SidebarHelperService } from './sidebar-helper.service';
import { HomeState } from '../store/home/home.reducer';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CategorySidebarItem } from './sidebar-view.models';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent extends BaseComponent implements OnChanges {
  items: CategorySidebarItem[];
  @Input() category: PostCategory;

  constructor(
    private store: Store<HomeState>,
    private sidebarHelper: SidebarHelperService,
  ) {
    super();
    this.items = sidebarHelper.categories;

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStateSidebarNavigation),
        filter(x => !!x && x !== SidebarNavigationType.Category),
      )
      .subscribe(() => {
        this.items.map(x => (x.class = ''));
      });

    this.sidebarHelper.postNavigated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.items = sidebarHelper.categories;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const category = changes?.category.currentValue as PostCategory;
    if (category) {
      const i = this.items.findIndex(x => x.category.value === category);
      this.items[i].class = 'selected';
    }
  }

  onNavigate(category: CategorySidebarItem) {
    this.items.map(x => (x.class = ''));
    category.class = 'selected';
    this.store.dispatch(
      new SidebarNavigation({
        sidebarNavigation: SidebarNavigationType.Category,
      }),
    );
  }
}
