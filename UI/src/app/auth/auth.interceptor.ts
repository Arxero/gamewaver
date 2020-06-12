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
    const token = this.authService.getToken();
    const isRenew = request.url.includes('renew');
    const isTokenExpired = Date.now() > token?.savedAt + token?.expiresIn * 1000;
    // check if token is expired if yes we request a new one
    if (!isRenew && token && isTokenExpired) {
      console.log('token expired');
      const newToken = await this.authService.renewToken();
      this.authService.saveToken(newToken);

      request = request.clone({
        setHeaders: {
          Authorization: this.authService.getAuthorizationHeaderValue(),
        },
      });
    }

    return next.handle(request).toPromise();
  }
}
