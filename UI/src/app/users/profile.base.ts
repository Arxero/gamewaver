import { UsersService } from './users.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { UserViewModel } from './user-view-models';
import { AuthService } from '@gamewaver/auth';
import { OnDestroyCleanup, UserInfo, UserRole } from '@gamewaver/shared';

export class ProfileBase extends OnDestroyCleanup {
  user: UserViewModel;
  private userId: string;
  private loggedInUser: UserViewModel;

  constructor(
    protected route: ActivatedRoute,
    protected usersService: UsersService,
    protected authService: AuthService,
  ) {
    super();
    this.userId = route.snapshot.params.id;

    // when own profile
    this.authService.profile$.pipe(takeUntil(this.destroyed$)).subscribe(loggedInUser => {
      this.loggedInUser = loggedInUser;

      if (this.isOwnProfile) {
        this.user = loggedInUser;
      }
    });

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

  get userInfo(): UserInfo {
    return {
      id: this.user.id,
      avatar: this.user.avatar,
      username: this.user.username,
      role: this.user.userRole,
      joinedAt: this.user.joinedAt,
    };
  }
}
