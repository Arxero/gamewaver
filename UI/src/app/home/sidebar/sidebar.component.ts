import {
  postSorts,
  SortUrl,
  postSortTimes,
  SortTime,
  PostSortViewModel,
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
  sortUrl: SortUrl;
  get postSortTimes() {
    return postSortTimes;
  }

  sortTimeMap: { [key: number]: string } = {
    [SortTime.Days1]: `?sort=upvotes:desc&filters=createdAt!between!${moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DD')},${moment().format('YYYY-MM-DD')},date`,
    [SortTime.Days7]: `?sort=upvotes:desc&filters=createdAt!between!${moment()
      .subtract(1, 'weeks')
      .format('YYYY-MM-DD')},${moment().format('YYYY-MM-DD')},date`,
    [SortTime.Days30]: `?sort=upvotes:desc&filters=createdAt!between!${moment()
      .subtract(1, 'months')
      .format('YYYY-MM-DD')},${moment().format('YYYY-MM-DD')},date`,
    [SortTime.All]: `?sort=upvotes:desc`,
  };

  selectedTime = new FormControl(SortTime.All);

  constructor(private router: Router) {
    // this.router.events
    //   .pipe(filter((event: RouterEvent) => event instanceof NavigationStart))
    //   .subscribe(e => {
    //     console.log(e);
    //   });
  }

  ngOnInit(): void {
    this.years = this.getYearsFromStart();
    this.months = this.getMonthsFromCurrentYear();
  }

  navigateByCategory(category: string) {
    this.router.navigateByUrl(`?filters=category!eq!${category}`);
  }

  onSubmit() {
    this.router.navigateByUrl(`?filters=content!like!${this.searchTerm.value}`);
  }

  getCurrentYear() {
    return moment().format('YYYY');
  }

  navigateToYear(year: string) {
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

    switch (sort.url) {
      case SortUrl.Popular:
        this.router.navigateByUrl(this.sortTimeMap[this.selectedTime.value]);
        break;
      case SortUrl.Commented:
        this.router.navigateByUrl(`?sort=comments:desc`);
        break;
      case SortUrl.Fresh:
        this.router.navigateByUrl('/');
        break;
    }
  }

  onSelectedTimeSort(value: SortTime) {
    if (this.sortUrl === SortUrl.Popular) {
      this.router.navigateByUrl(this.sortTimeMap[this.selectedTime.value]);
    }
  }
}
