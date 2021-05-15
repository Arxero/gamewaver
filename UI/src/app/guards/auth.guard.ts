import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthApiService } from '../services/auth.api.service';
import { SnackbarService } from '../services/snackbar.service';
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
