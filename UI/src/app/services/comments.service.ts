import { Injectable, Inject } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { GetCommentDto } from '../home/models/dto/get-comment.dto';
import { CreateCommentCmd } from '../home/models/cmd/create-comment.cmd';
import { IResponse } from '../shared/models/response';

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
}
