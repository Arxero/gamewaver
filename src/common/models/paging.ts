export class Paging {
  constructor(skip: number, take: number) {
    this.skip = skip;
    this.take = take;
  }

  skip: number;
  take: number;

  isValid(): boolean {
    return this.take > 0 && this.skip > -1;
  }
}
