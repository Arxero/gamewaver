import { PostCategory } from '@gamewaver/home';
import { SidebarNavigation, CategorySidebarItem } from './sidebar-view.models';
import { SidebarHelperService } from './sidebar-helper.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { takeUntil, filter } from 'rxjs/operators';
import { SidebarNavigationService } from '../home/services/sidebar-navigation.service';
import { OnDestroyCleanup } from '@gamewaver/shared';

@Component({
  selector: 'gw-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent extends OnDestroyCleanup implements OnChanges {
  @Input() category: PostCategory;
  items: CategorySidebarItem[];

  constructor(
    private sidebarHelper: SidebarHelperService,
    private sidebarNavigation: SidebarNavigationService,
  ) {
    super();
    this.items = sidebarHelper.categories;
    this.sidebarNavigation.navigation$
      .pipe(
        takeUntil(this.destroyed$),
        filter(x => x !== SidebarNavigation.Category),
      )
      .subscribe(() => {
        this.items.map(x => (x.class = ''));
      });

    this.sidebarHelper.postNavigated$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
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

  onNavigate(category: CategorySidebarItem): void {
    this.items.map(x => (x.class = ''));
    category.class = 'selected';
    this.sidebarNavigation.navigation = SidebarNavigation.Category;
  }
}
