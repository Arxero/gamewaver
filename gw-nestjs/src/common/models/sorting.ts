export enum SortDirection {
  Unknown = 'Unknown',
  ASC = 'ASC',
  DESC = 'DESC',
}

export class Sorting {
  constructor(data: string) {
    const [propertyName, sortDirection] = data.split(':');
    this.propertyName = propertyName;
    this.sortDirection = this.sortMap[sortDirection];
    this.sortDirectionDb = this.sortMapDb[sortDirection];
  }

  private sortMap: { [key: string]: SortDirection } = {
    asc: SortDirection.ASC,
    desc: SortDirection.DESC,
  };

  private sortMapDb: { [key: string]: 'ASC' | 'DESC' } = {
    asc: 'ASC',
    desc: 'DESC',
  };

  propertyName: string;
  sortDirection: SortDirection;
  sortDirectionDb: 'ASC' | 'DESC';


}
