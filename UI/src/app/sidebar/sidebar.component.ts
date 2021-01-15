import { QueryRequest, QueryParams } from './../shared/models/query-request';
import { BaseComponent } from './../shared/base.component';
import { SidebarSelectedItem } from './sidebar-view.models';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParsedQuery } from './parsed-query';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent extends BaseComponent {
  selectedItem: SidebarSelectedItem;

  constructor(private route: ActivatedRoute) {
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
  }
}
