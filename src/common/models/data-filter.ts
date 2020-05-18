import { Equal, FindOperator, Not, MoreThan, MoreThanOrEqual, LessThan, LessThanOrEqual, Like, Between, In, Any, IsNull } from 'typeorm';

export enum SearchType {
  Unknown = 'unknown',
  eq = 'Equal',
  ne = 'Not',
  gt = 'MoreThan',
  gte = 'MoreThanOrEqual',
  lt = 'LessThan',
  lte = 'LessThanOrEqual',
  like = 'Like',
  between = 'Between',
  in = 'In',
  any = 'Any',
  isNull = 'IsNull',
}

export class DataFiler {
  constructor(fieldName: string, searchOperator: string, searchValue: any) {
    this.fieldName = fieldName;
    this.searchOperator = this.searchOperatorMap[searchOperator];
    this.searchValue = searchValue;
    this.filter = this.setFilter(this.searchOperator, searchValue);
  }

  private searchOperatorMap: { [key: string]: SearchType } = {
    eq: SearchType.eq,
    ne: SearchType.ne,
    gt: SearchType.gt,
    gte: SearchType.gte,
    lt: SearchType.lt,
    lte: SearchType.lte,
    like: SearchType.like,
    between: SearchType.between,
    in: SearchType.in,
    any: SearchType.any,
    isNull: SearchType.isNull,
  };

  private setFilter(searchOperator: SearchType, searchValue: any) {
    switch (searchOperator) {
      case SearchType.eq:
        return Equal(searchValue);
      case SearchType.ne:
        return Not(searchValue);
      case SearchType.gt:
        return MoreThan(searchValue);
      case SearchType.gte:
        return MoreThanOrEqual(searchValue);
      case SearchType.lt:
        return LessThan(searchValue);
      case SearchType.lte:
        return LessThanOrEqual(searchValue);
      case SearchType.like:
        return Like(`%${searchValue}%`);
      case SearchType.between:
        const [from, to, type] = searchValue.split(',');
        if (type === 'date') {
          return Between(new Date(from), new Date(to));
        }
        return Between(+from, +to);
      case SearchType.in:
        return In(searchValue);
      case SearchType.any:
        return Any(searchValue);
      case SearchType.isNull:
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
