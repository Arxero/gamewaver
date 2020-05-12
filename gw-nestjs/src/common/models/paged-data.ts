export class PagedData<T> {
  constructor(items: T[], total: number) {
    this.items = items;
    this.total = total;
  }

  items: T[];
  total: number;
}
