import { SidebarSelectedItem } from './sidebar-view.models';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { ParsedQuery } from './parsed-query';
import { SidebarHelperService } from './sidebar-helper.service';
import { filter } from 'rxjs/operators';
import { OnDestroyCleanup, QueryRequest, QueryParams } from '@gamewaver/shared';

@Component({
  selector: 'gw-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent extends OnDestroyCleanup {
  selectedItem: SidebarSelectedItem;

  constructor(
    private route: ActivatedRoute,
    private sidebarHelper: SidebarHelperService,
    private router: Router,
  ) {
    super();
    this.route.queryParams.subscribe(params => {
      const queryRequest = new QueryRequest(params as QueryParams);
      const parsedQuery = new ParsedQuery(queryRequest);
      this.selectedItem = {
        sort: parsedQuery.sort,
        time: parsedQuery.time,
        category: parsedQuery.category,
        year: parsedQuery.year,
        month: parsedQuery.month,
      };
    });

    router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        if (event.url.startsWith('/post')) {
          this.sidebarHelper.fromPost = true;
        } else if (event.url.startsWith('/')) {
          this.sidebarHelper.fromPost = null;
        }
      });
  }
}
