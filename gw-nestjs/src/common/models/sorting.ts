export enum SortDirection {
  Unknown = 'Unknown',
  ASC = 'ASC',
  DESC = 'DESC',
}

export class Sorting {
  constructor(data: string) {
    data?.split(',').map(x => {
      const [propertyName, sortDirection] = x.split(':');
      this.order[propertyName] = this.sortMapDb[sortDirection];
    });
  }
  private sortMapDb: { [key: string]: 'ASC' | 'DESC' } = {
    asc: 'ASC',
    desc: 'DESC',
  };

  order: { [key: string]: any } = {};
}
