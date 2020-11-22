import { postCategories } from './../home/models/view/post-category';
import { Injectable } from '@angular/core';
import {
  SortSidebarItem,
  SortType,
  SortTime,
  CategorySidebarItem,
  SidebarItem,
} from './models/sidebar-view-model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class SidebarHelperService {
  get sorts(): SortSidebarItem[] {
    return this.getSortItems();
  }

  get categories(): CategorySidebarItem[] {
    return this.getCategoryItems();
  }

  get year(): string {
    return moment().format('YYYY');
  }

  get months(): SidebarItem[] {
    return this.getArchiveMonths();
  }

  get years(): SidebarItem[] {
    return this.getArchiveYears();
  }

  sortTimeMap: { [key: string]: string } = {
    [SortTime.Days1]: this.dateFilterSort(1, 'days'),
    [SortTime.Days7]: this.dateFilterSort(1, 'weeks'),
    [SortTime.Days30]: this.dateFilterSort(1, 'month'),
    [SortTime.All]: ``,
  };

  constructor() {}

  private dateFilterSort(
    amount: moment.DurationInputArg1,
    unit: moment.DurationInputArg2,
  ) {
    return `&filters=createdAt!between!${moment()
      .subtract(amount, unit)
      .format('YYYY-MM-DD')},${moment().format('YYYY-MM-DD')},date`;
  }

  private getSortItems(): SortSidebarItem[] {
    return [
      {
        label: SortType.Fresh,
        icon: 'schedule',
        description: 'Sort posts by new',
        sortType: SortType.Fresh,
        class: '',
        url: '?sort=createdAt:desc',
      },
      {
        label: SortType.Popular,
        icon: 'thumb_up_alt',
        description: 'Sort posts by upvotes',
        sortType: SortType.Popular,
        class: '',
        url: '?sort=upvotes:desc',
      },
      {
        label: SortType.Commented,
        icon: 'question_answer',
        description: 'Sort posts by comments',
        sortType: SortType.Commented,
        class: '',
        url: '?sort=comments:desc',
      },
    ];
  }

  private getCategoryItems(): CategorySidebarItem[] {
    return postCategories.map(x => ({
      category: x,
      label: x.label,
      url: `?filters=category!eq!${x.value}`,
      class: '',
    }));
  }

  private getArchiveMonths(): SidebarItem[] {
    return this.getMonthsFromCurrentYear().map(month => {
      const year = moment().year();
      const monthTemp = moment()
        .month(month)
        .format('MM');
      const daysInMonth = moment(`${year}-${monthTemp}`).daysInMonth();

      return {
        label: month,
        url: `?filters=createdAt!between!${year}-${monthTemp}-01,${year}-${monthTemp}-${daysInMonth},date`,
        class: 'month',
      };
    });
  }

  private getArchiveYears(): SidebarItem[] {
    return this.getYearsFromStart().map(year => ({
      label: year,
      url: `?filters=createdAt!between!${year}-01-01,${year}-12-31,date`,
      class: 'year',
    }));
  }

  private getYearsFromStart(): string[] {
    const yearsFromStart = moment().diff('2020-01-01', 'years') + 1;
    const years: string[] = [];
    for (let i = 0; i < yearsFromStart; i++) {
      years.push(`${2020 + i}`);
    }
    return years;
  }

  private getMonthsFromCurrentYear(): string[] {
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
}
