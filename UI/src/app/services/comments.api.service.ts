import { Injectable, Inject } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { IResponse } from '../shared/models/response';
import { DataFilter, Sorting, PagedData, Paging } from '../shared/models/common';
import { HttpParams } from '@angular/common/http';
import { CommentCmd, GetCommentDto, GetCommentsCountDto } from '../home/models/home.models';

@Injectable({
  providedIn: 'root'
})
export class CommentsApiService {
  BASE_URL = `comments`;

  constructor(
    @Inject('IHttpClientService') private httpClient: HttpClientService,
  ) {}

  create(cmd: CommentCmd, postId: string): Promise<IResponse<GetCommentDto>> {
    return this.httpClient.post<IResponse<GetCommentDto>>(`${this.BASE_URL}/${postId}`, cmd);
  }

  findAll(
    paging?: Paging,
    filters?: DataFilter[],
    sorting?: Sorting[],
  ): Promise<IResponse<PagedData<GetCommentDto>>> {
    if (paging || filters || sorting) {
      let httpParams = new HttpParams();
      httpParams = this.httpClient.setPaging(paging, httpParams);
      httpParams = this.httpClient.setFilters(filters, httpParams);
      httpParams = this.httpClient.setSorting(sorting, httpParams);

      return this.httpClient.get<IResponse<PagedData<GetCommentDto>>>(
        `${this.BASE_URL}?${httpParams.toString()}`,
      );
    }

    return this.httpClient.get<IResponse<PagedData<GetCommentDto>>>(
      `${this.BASE_URL}`,
    );
  }

  findCountByPostIds(ids: string[]): Promise<IResponse<GetCommentsCountDto[]>> {
    return this.httpClient.get<IResponse<GetCommentsCountDto[]>>(`${this.BASE_URL}/count?postIds=${ids.join(',')}`);
  }

  delete(id: string): Promise<IResponse<GetCommentDto>> {
    return this.httpClient.delete<IResponse<GetCommentDto>>(`${this.BASE_URL}/${id}`);
  }

  update(id: string, cmd: CommentCmd): Promise<IResponse<GetCommentDto>> {
    return this.httpClient.put<IResponse<GetCommentDto>>(`${this.BASE_URL}/${id}`, cmd);
  }
}
