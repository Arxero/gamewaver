import { EnvironmentService } from './../../services/environment.service';
import { OnDestroyCleanup } from '../on-destory-cleanup';
import { SortDirection, Sorting, DataFilter, SearchType, Paging } from './common';

export abstract class BaseService<T> extends OnDestroyCleanup {
  public sort: Sorting[] = [
    {
      propertyName: 'createdAt',
      sort: SortDirection.DESC,
    },
  ];

  public filter: DataFilter[] = [
    {
      fieldName: 'post',
      searchOperator: SearchType.In,
      searchValue: null,
    },
  ];

  protected paging: Paging = {
    skip: 0,
    take: 10,
  };

  constructor(private environmentService: EnvironmentService) {
    super();
    this.paging.take = this.environmentService.take;
  }

  abstract async getMany(): Promise<void>;
  abstract async create(cmd: T): Promise<void>;
  abstract async edit(cmd: T, id: string): Promise<void>;
  abstract async delete(id: string): Promise<void>;
}
