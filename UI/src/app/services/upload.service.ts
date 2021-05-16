import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentService } from '@gamewaver/services';
import { ImgurReponse, ImgurSuccess, ImgurError } from '@gamewaver/home';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  BASE_URL = this.environmentService.uploadApiUrl;
  CLIENT_ID = this.environmentService.uploadApiClientId;

  constructor(private http: HttpClient, private environmentService: EnvironmentService) {}

  upload(data: FormData): Promise<ImgurReponse<ImgurSuccess | ImgurError>> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', `Client-ID ${this.CLIENT_ID}`);

    return this.http
      .post<ImgurReponse<ImgurSuccess | ImgurError>>(`${this.BASE_URL}`, data, { headers })
      .toPromise();
  }
}
