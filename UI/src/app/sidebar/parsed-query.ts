import { PostCategory, postCategories } from '../home/models/post-category';
import { SortTime, SortType } from './sidebar-view.models';
import * as moment from 'moment';
import { QueryRequest } from '@gamewaver/shared';

export class ParsedQuery {
  private queryRequest: QueryRequest;
  private sortTypeMap: { [key: string]: SortType } = {
    createdAt: SortType.Fresh,
    upvotes: SortType.Popular,
    comments: SortType.Commented,
  };

  constructor(data: QueryRequest) {
    this.queryRequest = data;
  }

  get sort(): SortType {
    return this.getSort();
  }

  get time(): SortTime {
    return this.getTime();
  }

  get category(): PostCategory {
    return this.getCategory();
  }

  get year(): string {
    return this.getYear();
  }

  get month(): string {
    return this.getMonth();
  }

  private getSort(): SortType {
    if (this.queryRequest.sorting.length) {
      return this.sortTypeMap[this.queryRequest.sorting[0].propertyName];
    }

    return null;
    // throw new Error('Error parsing the query for sidebar!');
  }

  private getTime(): SortTime {
    if (this.queryRequest.sorting.length && this.queryRequest.filters) {
      const filter = this.queryRequest.filters[0];
      const [from, to] = filter.searchValue.split(',');
      const result = moment(to).diff(from, 'days');

      if (result > 7 && result <= 31) {
        return SortTime.Days30;
      } else if (result > 1 && result <= 7) {
        return SortTime.Days7;
      } else if (result === 1) {
        return SortTime.Days1;
      }
    }

    return SortTime.All;
  }

  private getCategory(): PostCategory {
    const filter = this.queryRequest.filters;

    if (filter && filter[0].fieldName === 'category') {
      return postCategories.find(x => x.value === filter[0].searchValue).value;
    }

    return null;
  }

  private getYear(): string {
    const filter = this.queryRequest.filters;

    if (filter && filter[0].fieldName === 'createdAt') {
      const [from, to] = filter[0].searchValue.split(',');
      const result = moment(to).diff(from, 'days');

      if (result > 31) {
        return moment(from)
          .year()
          .toString();
      }
    }
    return null;
  }

  private getMonth(): string {
    const filter = this.queryRequest.filters;

    if (filter && filter[0].fieldName === 'createdAt') {
      const [from, to] = filter[0].searchValue.split(',');
      const result = moment(to).diff(from, 'days');

      if (result <= 31) {
        return moment(from).format('MMM');
      }
    }
    return null;
  }
}
