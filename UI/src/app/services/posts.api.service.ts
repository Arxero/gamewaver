import { Injectable, Inject } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { PagedData, DataFilter, Sorting, Paging } from '../shared/models/common';
import { HttpParams } from '@angular/common/http';
import { GetPostDto, PostCmd, GetPostDtoEx } from '../home/models/home.models';
import { IResponse } from '@gamewaver/shared';

@Injectable({
  providedIn: 'root',
})
export class PostsApiService {
  BASE_URL = `posts`;

  constructor(@Inject('IHttpClientService') private httpClient: HttpClientService) {}

  create(cmd: PostCmd): Promise<IResponse<GetPostDto>> {
    return this.httpClient.post<IResponse<GetPostDto>>(`${this.BASE_URL}`, cmd);
  }

  findAll(
    paging?: Paging,
    filters?: DataFilter[],
    sorting?: Sorting[],
  ): Promise<IResponse<PagedData<GetPostDtoEx>>> {
    if (paging || filters || sorting) {
      let httpParams = new HttpParams();
      httpParams = this.httpClient.setPaging(paging, httpParams);
      httpParams = this.httpClient.setFilters(filters, httpParams);
      httpParams = this.httpClient.setSorting(sorting, httpParams);

      return this.httpClient.get<IResponse<PagedData<GetPostDtoEx>>>(
        `${this.BASE_URL}?${httpParams.toString()}`,
      );
    }

    return this.httpClient.get<IResponse<PagedData<GetPostDtoEx>>>(`${this.BASE_URL}`);
  }

  findOne(id: string): Promise<IResponse<GetPostDto>> {
    return this.httpClient.get<IResponse<GetPostDto>>(`${this.BASE_URL}/${id}`);
  }

  delete(id: string): Promise<IResponse<GetPostDto>> {
    return this.httpClient.delete<IResponse<GetPostDto>>(`${this.BASE_URL}/${id}`);
  }

  update(id: string, cmd: PostCmd): Promise<IResponse<GetPostDto>> {
    return this.httpClient.put<IResponse<GetPostDto>>(`${this.BASE_URL}/${id}`, cmd);
  }
}
