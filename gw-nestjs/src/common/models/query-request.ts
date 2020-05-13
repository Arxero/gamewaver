import { Paging } from './paging';
import { Sorting } from './sorting';
import { DataFiler } from './data-filter';
import { Defaults } from './defaults';

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
    this.sorting = data.sort?.split(',').map(x => new Sorting(x));

    if (!data.filters) {
      return;
    }
    this.filters = Object.keys(data.filters).map(x => {
      const so = Object.keys(data.filters[x])[0];
      const sv = Object.values(data.filters[x])[0];
      return new DataFiler(x, so, sv);
    });
  }

  paging: Paging;
  sorting: Sorting[];
  filters: DataFiler[];
}
