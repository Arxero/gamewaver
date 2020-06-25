import { Injectable, Inject } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { CreatePostCmd } from '../home/models/cmd/create-post.cmd';
import { GetPostDto } from '../home/models/dto/get-post.dto';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  BASE_URL = `posts`;

  constructor(
    @Inject('IHttpClientService') private httpClient: HttpClientService,
  ) {}

  create(cmd: CreatePostCmd): Promise<GetPostDto> {
    return this.httpClient.post<GetPostDto>(`${this.BASE_URL}`, cmd);
  }
}
