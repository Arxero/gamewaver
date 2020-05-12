export enum SortDirection {
  Unknown = 'Unknown',
  ASC = 'ASC',
  DESC = 'DESC'
  
}

export class Sorting {
  propertyName: string;
  sortDirection: SortDirection;
}

