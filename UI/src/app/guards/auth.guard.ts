import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthApiService, SnackbarService } from '@gamewaver/services';
import { loginFullRoute } from '../auth/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthApiService,
    private router: Router,
    private snackbarService: SnackbarService,
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate([loginFullRoute()]);
      this.snackbarService.showWarn('The page you are trying to access requires logged-in user.');
      return false;
    }

    return true;
  }
}
