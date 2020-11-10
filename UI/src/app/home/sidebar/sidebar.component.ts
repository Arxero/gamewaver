import { SidebarNavigation } from './../../store/home/home.actions';
import { HomeState } from './../../store/home/home.reducer';
import { Store } from '@ngrx/store';
import {
  postSorts,
  SortUrl,
  postSortTimes,
  SortTime,
  PostSortViewModel,
  dateFilterSort,
  SidebarNavigationType,
} from './../models/view/post-sort';
import { Component, OnInit } from '@angular/core';
import { postCategories } from '../models/view/post-category';
import {
  Router,
  NavigationStart,
  ActivatedRoute,
  RouterEvent,
} from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  get categories() {
    return postCategories;
  }

  get sorts() {
    return postSorts;
  }
  searchTerm = new FormControl('');
  years: string[];
  months: string[];
  sortUrl: SortUrl = SortUrl.Fresh;
  get postSortTimes() {
    return postSortTimes;
  }

  sortTimeMap: { [key: number]: string } = {
    [SortTime.Days1]: dateFilterSort(1, 'days'),
    [SortTime.Days7]: dateFilterSort(1, 'weeks'),
    [SortTime.Days30]: dateFilterSort(1, 'month'),
    [SortTime.All]: ``,
  };

  selectedTime = new FormControl(SortTime.All);

  constructor(private router: Router, private store: Store<HomeState>) {
    // this.router.events
    //   .pipe(filter((event: RouterEvent) => event instanceof NavigationStart))
    //   .subscribe(e => {
    //     console.log(e.url);
    //   });
  }

  ngOnInit(): void {
    this.years = this.getYearsFromStart();
    this.months = this.getMonthsFromCurrentYear();
  }

  navigateByCategory(category: string) {
    this.store.dispatch(new SidebarNavigation({ sidebarNavigation: SidebarNavigationType.Category }));
    this.router.navigateByUrl(`?filters=category!eq!${category}`);
  }

  onSubmit() {
    this.store.dispatch(new SidebarNavigation({ sidebarNavigation: SidebarNavigationType.Search }));
    this.router.navigateByUrl(`?filters=content!like!${this.searchTerm.value}`);
  }

  getCurrentYear() {
    return moment().format('YYYY');
  }

  navigateToYear(year: string) {
    this.store.dispatch(new SidebarNavigation({ sidebarNavigation: SidebarNavigationType.Archive }));
    this.router.navigateByUrl(
      `?filters=createdAt!between!${year}-01-01,${year}-12-31,date`,
    );
  }

  navigateToMonth(month: string) {
    const year = moment().year();
    const monthTemp = moment()
      .month(month)
      .format('MM');
    const daysInMonth = moment(`${year}-${monthTemp}`).daysInMonth();
    this.router.navigateByUrl(
      `?filters=createdAt!between!${year}-${monthTemp}-01,${year}-${monthTemp}-${daysInMonth},date`,
    );
  }

  getYearsFromStart() {
    const yearsFromStart = moment().diff('2020-01-01', 'years') + 1;
    const years: string[] = [];
    for (let i = 0; i < yearsFromStart; i++) {
      years.push(`${2020 + i}`);
    }
    return years;
  }

  getMonthsFromCurrentYear() {
    const monthsFromYear =
      moment().diff(`${moment().year()}-01-01`, 'months') + 1;
    const months: string[] = [];
    for (let i = 1; i <= monthsFromYear; i++) {
      const temp = i <= 9 ? `0` : '';
      const month = moment(`${moment().year()}-${temp}${i}-01`).format('MMM');
      months.push(month);
    }
    return months;
  }

  navigateBySort(sort: PostSortViewModel) {
    this.sortUrl = sort.url;
    this.sorts.forEach(x => (x.iconColor = null));
    sort.iconColor = 'primary';
    this.navigateSorting(this.sortUrl);
  }

  onSelectedTimeSort(value: SortTime) {
    this.navigateSorting(this.sortUrl);
  }

  navigateSorting(value: SortUrl) {
    this.store.dispatch(new SidebarNavigation({ sidebarNavigation: SidebarNavigationType.Sort }));

    switch (value) {
      case SortUrl.Popular:
        this.router.navigateByUrl(
          `?sort=upvotes:desc${this.sortTimeMap[this.selectedTime.value]}`,
        );
        break;
      case SortUrl.Commented:
        this.router.navigateByUrl(
          `?sort=comments:desc${this.sortTimeMap[this.selectedTime.value]}`,
        );
        break;
      case SortUrl.Fresh:
        this.router.navigateByUrl(
          `${this.sortTimeMap[this.selectedTime.value]}`,
        );
        break;
    }
  }
}
