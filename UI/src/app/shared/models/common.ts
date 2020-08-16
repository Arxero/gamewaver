export interface PagedData<T> {
  total: number;
  items: T[];
}

export interface Paging {
  skip: number;
  take: number;
}

export interface DataEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum SortDirection {
  Unknown = 'Unknown',
  ASC = 'asc',
  DESC = 'desc',
}

export interface Sorting {
  propertyName: string;
  sort: SortDirection;
}

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

export interface DataFilter {
  fieldName: string;
  searchOperator: SearchType;
  searchValue: any;
}

export interface DataFilterDef {
  filters: DataFilter[];
}

export interface SortingDef {
  sorting: Sorting[];
}

export interface BaseCmd {
  reCaptchaaToken: string;
}
