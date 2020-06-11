import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return from(this.handle(request, next));
  }

  async handle(request: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getAccessToken();
    // check if token is expired if yer we request a new one
    if (token && Date.now() > token.savedAt + (token.expiresIn * 1000)) {
      console.log('token expired');
    }

    // Important: Note the .toPromise()
    return next.handle(request).toPromise();
  }
}
