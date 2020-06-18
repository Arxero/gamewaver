import { Injectable, Inject } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { User } from '../users/models/dto/user';
import { UpdateUserCmd } from '../users/models/cmd/update-user.cmd';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  BASE_URL = `users`;

  constructor(
    @Inject('IHttpClientService') private httpClient: HttpClientService,
  ) {}

  update(id: string, cmd: UpdateUserCmd): Promise<User> {
    return this.httpClient.put<User>(`${this.BASE_URL}/${id}`, cmd);
  }
}
