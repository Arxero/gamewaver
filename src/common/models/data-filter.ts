import {
  Equal,
  FindOperator,
  Not,
  MoreThan,
  MoreThanOrEqual,
  LessThan,
  LessThanOrEqual,
  Like,
  Between,
  In,
  Any,
  IsNull,
} from 'typeorm';
import { filter } from 'lodash';

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

export class DataFilter {
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

  private setFilter(
    searchOperator: SearchType,
    searchValue: any,
  ): FindOperator<any> {
    switch (searchOperator) {
      case SearchType.Equal:
        const findEqual = Equal(searchValue);
        this.filterSql  = `${this.fieldName} = '${searchValue}'`;
        return findEqual;
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
        const findLike = Like(`%${searchValue}%`);
        this.filterSql =  `${this.fieldName} LIKE '%${this.searchValue}%'`;
        return findLike;
      case SearchType.Between:
        const [from, to, type] = searchValue.split(',');
        const toPlusDay = new Date(to).setDate(new Date(to).getDate() + 1);
        if (type === 'date') {
          const findBetween = Between(new Date(from), new Date(toPlusDay));
          this.filterSql = `${this.fieldName} BETWEEN '${new Date(from).toJSON()}' AND '${new Date(toPlusDay).toJSON()}'`;
          return findBetween;
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
  filterSql: any;
}
