import { Paging } from './paging';
import { Sorting } from './sorting';
import { DataFiler } from './data-filter';

export class QueryRequest {
  paging: Paging;
  sorting: Sorting[];
  filters: DataFiler[];
}
