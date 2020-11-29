import { QueryRequest, QueryParams } from './../shared/models/query-request';
import { BaseComponent } from './../shared/base.component';
import { SidebarHelperService } from './sidebar-helper.service';
import { postCategories } from '../home/models/view/post-category';
import { SidebarNavigation } from '../store/home/home.actions';
import { HomeState } from '../store/home/home.reducer';
import { Store, select } from '@ngrx/store';
import {
  SortUrl,
  SortTime,
  SidebarNavigationType,
  SortSidebarItem,
  CategorySidebarItem,
  SidebarItem,
  SortType,
  SidebarSelectedItem,
} from './models/sidebar-view-model';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  Router,
  NavigationStart,
  ActivatedRoute,
  RouterEvent,
} from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { filter, takeUntil } from 'rxjs/operators';
import { homeStateSidebarNavigation } from '../store/home/home.selectors';
import { ParsedQuery } from './models/parsed-query';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent extends BaseComponent implements OnInit {
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

  ngOnInit(): void {}
}
