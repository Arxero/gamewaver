import { Injectable, Inject } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { User, UpdateUserCmd } from '../users/user';
import { HttpParams } from '@angular/common/http';
import { IResponse, DataFilter, PagedData } from '@gamewaver/shared';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  BASE_URL = `users`;

  constructor(@Inject('IHttpClientService') private httpClient: HttpClientService) {}

  update(id: string, cmd: UpdateUserCmd): Promise<IResponse<User>> {
    return this.httpClient.put<IResponse<User>>(`${this.BASE_URL}/${id}`, cmd);
  }

  findAll(filters?: DataFilter[]): Promise<IResponse<PagedData<User>>> {
    if (filters) {
      let httpParams = new HttpParams();
      httpParams = this.httpClient.setFilters(filters, httpParams);

      return this.httpClient.get<IResponse<PagedData<User>>>(`${this.BASE_URL}?${httpParams.toString()}`);
    }

    return this.httpClient.get<IResponse<PagedData<User>>>(`${this.BASE_URL}`);
  }

  findOne(id: string): Promise<IResponse<User>> {
    return this.httpClient.get<IResponse<User>>(`${this.BASE_URL}/${id}`);
  }
}
