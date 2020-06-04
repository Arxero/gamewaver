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
}
