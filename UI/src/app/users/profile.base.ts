import { UsersService } from './users.service';
import { ActivatedRoute } from '@angular/router';
import { AuthState } from './../store/auth/auth.reducer';
import { Store, select } from '@ngrx/store';
import { OnDestroyCleanup } from '../shared/on-destory-cleanup';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../store/auth/auth.selectors';
import { UserViewModel } from './user-view-models';
import { UserRole } from './user';
import { AuthService } from '../auth/auth.service';

export class ProfileBase extends OnDestroyCleanup {
  user: UserViewModel;
  private userId: string;
  private loggedInUser: UserViewModel;

  constructor(
    protected route: ActivatedRoute,
    protected usersService: UsersService,
    protected authService: AuthService
  ) {
    super();
    this.userId = route.snapshot.params.id;

    // when own profile
    this.authService.profile$.pipe(takeUntil(this.destroyed$)).subscribe(loggedInUser => {
      this.loggedInUser = loggedInUser;

        if (this.isOwnProfile) {
          this.user = loggedInUser;
        }
    })

    // when some random user profile and current user is admin
    if (!this.isOwnProfile) {
      this.usersService.getOne(this.userId);
    }
  }

  get isOwnProfile(): boolean {
    return this.userId === this.loggedInUser?.id;
  }

  get isEditAllowed(): boolean {
    return this.userId === this.loggedInUser?.id || this.loggedInUser?.role === UserRole.ADMIN;
  }
}
