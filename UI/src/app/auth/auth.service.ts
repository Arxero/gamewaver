import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';
import { AuthApiService } from '../services/auth.api.service';
import { LoadingService } from '../services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../users/users.service';
import { Router } from '@angular/router';
import { UserViewModel } from '../users/user-view-models';

@Injectable()
export class AuthService {
  private _profileSubject = new BehaviorSubject<UserViewModel>(null);
  private _profile: UserViewModel;

  isAuthenticated: boolean;

  get profile$(): Observable<UserViewModel> {
    return this._profileSubject.asObservable();
  }

  constructor(
    private snackbarService: SnackbarService,
    private authApiService: AuthApiService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private usersService: UsersService,
    private router: Router,
  ) {}
}
