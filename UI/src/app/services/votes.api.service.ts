import { PostVoteCmd, GetVoteDto, GetVotesCountDto } from '@gamewaver/home';
import { Injectable, Inject } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { IResponse } from '@gamewaver/shared';

@Injectable({
  providedIn: 'root',
})
export class VotesApiService {
  BASE_URL = `votes`;

  constructor(@Inject('IHttpClientService') private httpClient: HttpClientService) {}

  create(cmd: PostVoteCmd): Promise<IResponse<GetVoteDto>> {
    return this.httpClient.post<IResponse<GetVoteDto>>(`${this.BASE_URL}`, cmd);
  }

  delete(id: string): Promise<IResponse<GetVoteDto>> {
    return this.httpClient.delete<IResponse<GetVoteDto>>(`${this.BASE_URL}/${id}`);
  }

  findManyByPostId(ids: string[]): Promise<IResponse<GetVoteDto[]>> {
    const idsString = ids.join(',');

    return this.httpClient.get<IResponse<GetVoteDto[]>>(`${this.BASE_URL}?postIds=${idsString}`);
  }

  findCountByPostId(ids: string[]): Promise<IResponse<GetVotesCountDto[]>> {
    const idsString = ids.join(',');

    return this.httpClient.get<IResponse<GetVotesCountDto[]>>(`${this.BASE_URL}/count?postIds=${idsString}`);
  }
}
