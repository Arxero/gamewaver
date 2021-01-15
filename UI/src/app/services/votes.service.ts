import { CreatePostVoteCmd, GetVoteDto } from './../home/models/home.models';
import { IResponse } from './../shared/models/response';
import { Injectable, Inject } from '@angular/core';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root',
})
export class VotesService {
  BASE_URL = `votes`;

  constructor(
    @Inject('IHttpClientService') private httpClient: HttpClientService,
  ) {}

  create(cmd: CreatePostVoteCmd): Promise<IResponse<GetVoteDto>> {
    return this.httpClient.post<IResponse<GetVoteDto>>(`${this.BASE_URL}`, cmd);
  }

  delete(id: string): Promise<IResponse<GetVoteDto>> {
    return this.httpClient.delete<IResponse<GetVoteDto>>(`${this.BASE_URL}/${id}`);
  }

  findManyByPostId(ids: string[]): Promise<IResponse<GetVoteDto[]>> {
    const idsString = ids.join(',');
    return this.httpClient.get<IResponse<GetVoteDto[]>>(`${this.BASE_URL}?postIds=${idsString}`);
  }
}
