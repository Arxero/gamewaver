export enum SearchType {
  Unknown = 'unknown',
  Range = 'range',
  EqualTo = 'equalTo',
  Like = 'like',
}

export class DataFiler {
  fieldName: string;
  searchType: SearchType;
}