import { postCategories } from '../home/models/post-category';
import { Injectable } from '@angular/core';
import {
  SortSidebarItem,
  SortType,
  SortTime,
  CategorySidebarItem,
  SidebarItem,
} from './sidebar-view.models';
import * as moment from 'moment';
import { Subject, Observable } from 'rxjs';

@Injectable()
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

  set fromPost(value: boolean) {
    this._fromPost = value;
    this._postNavigated.next();
  }

  private _postNavigated = new Subject<any>();
  private _fromPost: boolean;

  get postNavigated$(): Observable<any> {
    return this._postNavigated.asObservable();
  }

  sortTimeMap: { [key: string]: string } = {
    [SortTime.Days1]: this.dateFilterSort(1, 'days'),
    [SortTime.Days7]: this.dateFilterSort(1, 'weeks'),
    [SortTime.Days30]: this.dateFilterSort(1, 'month'),
    [SortTime.All]: ``,
  };

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
        url: 'createdAt:desc',
        fromPost: this._fromPost,
      },
      {
        label: SortType.Popular,
        icon: 'thumb_up_alt',
        description: 'Sort posts by upvotes',
        sortType: SortType.Popular,
        class: '',
        url: 'upvotes:desc',
        fromPost: this._fromPost,
      },
      {
        label: SortType.Commented,
        icon: 'question_answer',
        description: 'Sort posts by comments',
        sortType: SortType.Commented,
        class: '',
        url: 'comments:desc',
        fromPost: this._fromPost,
      },
    ];
  }

  private getCategoryItems(): CategorySidebarItem[] {
    return postCategories.map(x => ({
      category: x,
      label: x.label,
      url: `category!eq!${x.value}`,
      class: '',
      fromPost: this._fromPost,
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
        url: `createdAt!between!${year}-${monthTemp}-01,${year}-${monthTemp}-${daysInMonth},date`,
        class: 'month',
        fromPost: this._fromPost,
      };
    });
  }

  private getArchiveYears(): SidebarItem[] {
    return this.getYearsFromStart().map(year => ({
      label: year,
      url: `createdAt!between!${year}-01-01,${year}-12-31,date`,
      class: 'year',
      fromPost: this._fromPost,
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
