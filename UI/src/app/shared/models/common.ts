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
  invalid = 0,
  asc,
  desc,
}

export interface Sorting {
  propertyName: string;
  sort: SortDirection;
}

export interface DataFilter {
  fieldName: string;
  searchOperator: string;
  searchValue: any;
}

export interface DataFilterDef {
  filters: DataFilter[];
}

export interface SortingDef {
  sorting: Sorting[];
}
