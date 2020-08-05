import { Component, OnInit } from '@angular/core';
import { postCategories } from '../models/view/post-category';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  get categories() {
    return postCategories;
  }
  searchTerm: FormControl;
  years: string[];
  months: string[];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.searchTerm = new FormControl('');
    this.years = this.getYearsFromStart();
    this.months = this.getMonthsFromCurrentYear();
  }

  navigate(category: string) {
    this.router.navigateByUrl(`?filters=category!eq!${category}`);
  }

  onSubmit() {
    this.router.navigateByUrl(
      `?filters=content!like!${this.searchTerm.value}`,
    );
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
    const monthTemp = moment().month(month).format('MM');
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
    const monthsFromYear = moment().diff(`${moment().year()}-01-01`, 'months') + 1;
    const months: string[] = [];
    for (let i = 1; i <= monthsFromYear; i++) {
      const temp = i <= 9 ? `0` : '';
      const month = moment(`${moment().year()}-${temp}${i}-01`).format('MMM');
      months.push(month);
    }
    return months;
  }
}
