import { Injectable, Inject } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { CreatePostCmd } from '../home/models/cmd/create-post.cmd';
import { GetPostDto } from '../home/models/dto/get-post.dto';
import { IResponse } from '../shared/models/response';
import { PagedData } from '../shared/models/common';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  BASE_URL = `posts`;

  constructor(
    @Inject('IHttpClientService') private httpClient: HttpClientService,
  ) {}

   create(cmd: CreatePostCmd): Promise<IResponse<GetPostDto>> {
    return this.httpClient.post<IResponse<GetPostDto>>(`${this.BASE_URL}`, cmd);
  }

  findAll(): Promise<IResponse<PagedData<GetPostDto>>> {
    return this.httpClient.get<IResponse<PagedData<GetPostDto>>>(`${this.BASE_URL}`);
  }
}
