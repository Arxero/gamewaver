import { SnackbarService } from './../../services/snackbar.service';
import { ResponseError } from './response';
import { EnvironmentService } from './../../services/environment.service';
import { OnDestroyCleanup } from '../on-destory-cleanup';
import { SortDirection, Sorting, DataFilter, SearchType, Paging, SnackbarErrors } from './common';

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

  constructor(private environmentService: EnvironmentService, protected snackbarService: SnackbarService) {
    super();
    this.paging.take = this.environmentService.take;
  }

  getOne?(id: string): Promise<void>
  getMany?(): Promise<void>;
  create?(cmd: T): Promise<void>;
  edit?(cmd: T, id: string): Promise<void>;
  delete?(id: string): Promise<void>;

  protected handleFailure(error: string | ResponseError, message: SnackbarErrors): void {
    if (typeof error === 'string') {
      this.snackbarService.showWarn(`${message} ${error}`);
      throw new Error(error);
    }

    this.snackbarService.showWarn(`${message} ${error.message}`);
    throw new Error(error.message);
  }
}
