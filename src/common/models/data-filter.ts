import { Equal, FindOperator, Not, MoreThan, MoreThanOrEqual, LessThan, LessThanOrEqual, Like, Between, In, Any, IsNull } from 'typeorm';

export enum SearchType {
  Unknown = 'unknown',
  Equal = 'eq',
  Not = 'ne',
  MoreThan = 'gt',
  MoreThanOrEqual = 'gte',
  LessThan = 'lt',
  LessThanOrEqual = 'lte',
  Like = 'like',
  Between = 'between',
  In = 'in',
  Any = 'any',
  IsNull = 'isNull',
}

export class DataFiler {
  constructor(fieldName: string, searchOperator: string, searchValue: any) {
    this.fieldName = fieldName;
    this.searchOperator = this.searchOperatorMap[searchOperator];
    this.searchValue = searchValue;
    this.filter = this.setFilter(this.searchOperator, searchValue);
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

  private setFilter(searchOperator: SearchType, searchValue: any) {
    switch (searchOperator) {
      case SearchType.Equal:
        return Equal(searchValue);
      case SearchType.Not:
        return Not(searchValue);
      case SearchType.MoreThan:
        return MoreThan(searchValue);
      case SearchType.MoreThanOrEqual:
        return MoreThanOrEqual(searchValue);
      case SearchType.LessThan:
        return LessThan(searchValue);
      case SearchType.LessThanOrEqual:
        return LessThanOrEqual(searchValue);
      case SearchType.Like:
        return Like(`%${searchValue}%`);
      case SearchType.Between:
        const [from, to, type] = searchValue.split(',');
        if (type === 'date') {
          return Between(new Date(from), new Date(to));
        }
        return Between(+from, +to);
      case SearchType.In:
        return In(searchValue.split(','));
      case SearchType.Any:
        return Any(searchValue);
      case SearchType.IsNull:
        return IsNull();

      default:
        throw new Error('Search operator not implemented!');
    }
  }

  fieldName: string;
  searchOperator: SearchType;
  searchValue: any;
  filter: FindOperator<any>;
}
