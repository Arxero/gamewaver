import { Injectable, Inject } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { CreatePostCmd } from '../home/models/cmd/create-post.cmd';
import { GetPostDto } from '../home/models/dto/get-post.dto';
import { IResponse } from '../shared/models/response';
import {
  PagedData,
  DataFilter,
  Sorting,
  SortDirection,
  Paging,
} from '../shared/models/common';
import { HttpParams } from '@angular/common/http';
import { UpdatePostCmd } from '../home/models/cmd/update-post.cmd';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  BASE_URL = `posts`;

  constructor(
    @Inject('IHttpClientService') private httpClient: HttpClientService,
  ) {}

  create(cmd: CreatePostCmd): Promise<IResponse<GetPostDto>> {
    return this.httpClient.post<IResponse<GetPostDto>>(`${this.BASE_URL}`, cmd);
  }

  findAll(
    paging?: Paging,
    filters?: DataFilter[],
    sorting?: Sorting[],
  ): Promise<IResponse<PagedData<GetPostDto>>> {
    if (paging || filters || sorting) {
      let httpParams = new HttpParams();
      httpParams = this.httpClient.setPaging(paging, httpParams);
      httpParams = this.httpClient.setFilters(filters, httpParams);
      httpParams = this.httpClient.setSorting(sorting, httpParams);

      return this.httpClient.get<IResponse<PagedData<GetPostDto>>>(
        `${this.BASE_URL}?${httpParams.toString()}`,
      );
    }

    return this.httpClient.get<IResponse<PagedData<GetPostDto>>>(
      `${this.BASE_URL}`,
    );
  }

  findOne(id: string): Promise<IResponse<GetPostDto>> {
    return this.httpClient.get<IResponse<GetPostDto>>(`${this.BASE_URL}/${id}`);
  }

  delete(id: string): Promise<IResponse<GetPostDto>> {
    return this.httpClient.delete<IResponse<GetPostDto>>(`${this.BASE_URL}/${id}`);
  }

  update(id: string, cmd: UpdatePostCmd): Promise<IResponse<GetPostDto>> {
    return this.httpClient.put<IResponse<GetPostDto>>(`${this.BASE_URL}/${id}`, cmd);
  }

}
