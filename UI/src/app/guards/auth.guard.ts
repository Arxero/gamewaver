import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthApiService } from '../services/auth.api.service';
import { loginFullRoute } from '../auth/auth.routing';
import { SnackbarService } from '../services/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthApiService,
    private router: Router,
    private snackbarService: SnackbarService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate([loginFullRoute()]);
      this.snackbarService.showWarn('The page you are trying to access requires logged-in user.');
      return false;
    }

    return true;
  }
}
