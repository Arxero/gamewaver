import { Injectable, Inject } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { User } from '../users/models/dto/user';
import { UpdateUserCmd } from '../users/models/cmd/update-user.cmd';
import { PagedData, DataFilter } from '../shared/models/common';
import { IResponse } from '../shared/models/response';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  BASE_URL = `users`;

  constructor(
    @Inject('IHttpClientService') private httpClient: HttpClientService,
  ) {}

  update(id: string, cmd: UpdateUserCmd): Promise<User> {
    return this.httpClient.put<User>(`${this.BASE_URL}/${id}`, cmd);
  }

  findAll(filters?: DataFilter[]): Promise<IResponse<PagedData<User>>> {
    if (filters) {
      let httpParams = new HttpParams();
      httpParams = this.httpClient.setFilters(filters, httpParams);

      return this.httpClient.get<IResponse<PagedData<User>>>(`${this.BASE_URL}?${httpParams.toString()}`);
    }

    return this.httpClient.get<IResponse<PagedData<User>>>(`${this.BASE_URL}`);
  }
}
