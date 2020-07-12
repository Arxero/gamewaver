import { Injectable, Inject } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { GetCommentDto } from '../home/models/dto/get-comment.dto';
import { CreateCommentCmd } from '../home/models/cmd/create-comment.cmd';
import { IResponse } from '../shared/models/response';
import { DataFilter, Sorting, PagedData } from '../shared/models/common';
import { HttpParams } from '@angular/common/http';
import { UpdateCommentCmd } from '../home/models/cmd/update-comment.cmd';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  BASE_URL = `comments`;

  constructor(
    @Inject('IHttpClientService') private httpClient: HttpClientService,
  ) {}

  create(cmd: CreateCommentCmd, postId: string): Promise<IResponse<GetCommentDto>> {
    return this.httpClient.post<IResponse<GetCommentDto>>(`${this.BASE_URL}/${postId}`, cmd);
  }

  findAll(
    filters?: DataFilter[],
    sorting?: Sorting[],
  ): Promise<IResponse<PagedData<GetCommentDto>>> {
    if (filters || sorting) {
      let httpParams = new HttpParams();
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

  delete(id: string): Promise<IResponse<GetCommentDto>> {
    return this.httpClient.delete<IResponse<GetCommentDto>>(`${this.BASE_URL}/${id}`);
  }

  update(id: string, cmd: UpdateCommentCmd): Promise<IResponse<GetCommentDto>> {
    return this.httpClient.put<IResponse<GetCommentDto>>(`${this.BASE_URL}/${id}`, cmd);
  }
}
