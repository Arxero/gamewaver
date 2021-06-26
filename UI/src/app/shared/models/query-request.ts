import { Paging, DataFilter, SearchType, Sorting } from './common';

export interface QueryParams {
  skip: string;
  take: string;
  sort: string;
  filters: string[];
  fromPost?: string;
}

export class QueryRequest {
  constructor(data: QueryParams) {
    this.paging = { skip: +data.skip, take: +data.take } as Paging;
    this.sorting =
      data.sort?.split(',').map(sort => {
        const [propertyName, sortDirection] = sort.split(':');

        return {
          propertyName,
          sort: sortDirection,
        } as Sorting;
      }) || [];

    this.fromPost = data.fromPost
      ? JSON.parse(data.fromPost?.toLowerCase())
      : null;

    if (!data.filters) {
      return;
    }

    this.filters = [].concat(data.filters).map(filter => {
      const [fieldName, searchOperator, searchValue] = filter.split('!');

      return {
        fieldName,
        searchOperator: this.searchOperatorMap[searchOperator],
        searchValue,
      } as DataFilter;
    });
  }

  private searchOperatorMap: { [key: string]: SearchType } = {
    eq: SearchType.Equal,
    ne: SearchType.Not,
    gt: SearchType.MoreThan,
    gte: SearchType.MoreThanOrEqual,
    lt: SearchType.LessThan,
    lte: SearchType.LessThanOrEqual,
    like: SearchType.Like,
    between: SearchType.Between,
    in: SearchType.In,
    any: SearchType.Any,
    isNull: SearchType.IsNull,
  };

  paging: Paging;
  sorting: Sorting[];
  filters: DataFilter[];
  fromPost?: boolean;
}
