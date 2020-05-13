export enum SearchType {
  Unknown = 'unknown',
  Range = 'range',
  EqualTo = 'equalTo',
  Like = 'like',
}

export enum SearchOperator {
  eq = '=',
  gt = '>',
  gte = '>=',
  lt = '<',
  lte = '=<',
}

export class DataFiler {
  constructor(fieldName: string, searchOperator: string, searchValue: any) {
    this.fieldName = fieldName;
    this.searchOperator = this.searchOperatorMap[searchOperator];
    this.searchValue = searchValue;
  }

  private searchOperatorMap: { [key: string]: SearchOperator } = {
    eq: SearchOperator.eq,
    gt: SearchOperator.gt,
    gte: SearchOperator.gte,
    lt: SearchOperator.lt,
    lte: SearchOperator.lte,
  };

  fieldName: string;
  searchOperator: SearchOperator;
  searchValue: any;
}
