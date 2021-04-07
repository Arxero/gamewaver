import { GetUserInfoSuccessAction } from './../store/auth/auth.actions';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UsersApiService } from '../services/users.api.service';
import { LoadingService } from '../services/loading.service';
import { SnackbarService } from '../services/snackbar.service';
import { UserViewModel } from './user-view-models';
import { User, UserRole, UpdateUserCmd } from './user';
import * as moment from 'moment';
import { AuthState } from '../store/auth/auth.reducer';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { usersProfileFullRoute } from './users.routing';

@Injectable()
export class UsersService {
  private _userSubject = new Subject<UserViewModel>();
  private _user: UserViewModel;

  get user$(): Observable<UserViewModel> {
    return this._userSubject.asObservable();
  }

  constructor(
    private usersApiService: UsersApiService,
    private loadingService: LoadingService,
    private snackbarService: SnackbarService,
    private store: Store<AuthState>,
    private router: Router
  ) {}

  async loadUser(id: string): Promise<void> {
    try {
      this.loadingService.setUILoading();
      const user = (await this.usersApiService.findOne(id)).result;
      this._user = this.mapUser(user);
      this._userSubject.next(this._user);
    } catch ({ error }) {
      this.snackbarService.showWarn('Get User Failed ' + error.message);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  async editUser(id: string, cmd: UpdateUserCmd, isOwnProfile: boolean): Promise<void> {
    try {
      this.loadingService.setUILoading();
      const user = (await this.usersApiService.update(id, cmd)).result;
      this._user = this.mapUser(user);
      this._userSubject.next(this._user);
      this.snackbarService.showInfo('Profile Edited Successfully');

      if (isOwnProfile) {
        this.store.dispatch(new GetUserInfoSuccessAction({ userProfile: this._user }));
      }

      this.router.navigateByUrl(`/users/profile/${this._user.id}`);
    } catch ({ error }) {
      this.snackbarService.showWarn('Edit User Failed ' + error.message);
    } finally {
      this.loadingService.setUILoading(false);
    }
  }

  clear() {
    this._user = null;
  }

  mapUser(user: User): UserViewModel {
    return {
      ...user,
      joinedAt: `Joined ${moment(user.createdAt).format('MMMM DD, YYYY [at] hh:mm A')}`,
      userRole: user.role !== UserRole.USER ? user.role : null,
      defaultAvatar: '/assets/images/common/no_avatar.jpg',
    } as UserViewModel;
  }
}
