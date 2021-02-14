import { Paging } from './paging';
import { Sorting } from './sorting';
import { DataFilter } from './data-filter';
import { Defaults } from './defaults';
import { FindOperator } from 'typeorm';

export interface QueryParams {
  skip: string;
  take: string;
  sort: string;
  filters: any;
}

export class QueryRequest {
  constructor(data: QueryParams) {
    const paging = new Paging(+data.skip, +data.take);
    this.paging = paging.isValid() ? paging : Defaults.Paging;
    this.sorting = new Sorting(data.sort);

    if (!data.filters) {
      return;
    }

    this.filters = Object.keys(data.filters).map(x => {
      const searchOperator = Object.keys(data.filters[x])[0];
      const searchValue = Object.values(data.filters[x])[0];
      return new DataFilter(x, searchOperator, searchValue);
    });
    
    this.filters.forEach(x => {
      this.filter[x.fieldName] = x.filter;
    });

  }

  paging: Paging;
  sorting: Sorting;
  filters: DataFilter[];
  filter: { [key: string]: FindOperator<any> } = {};
}
