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
} from './models/sidebar-view-model';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent extends BaseComponent implements OnInit {

  constructor(private router: Router, private store: Store<HomeState>) {
    super();
  }

  ngOnInit(): void {
  }
}
