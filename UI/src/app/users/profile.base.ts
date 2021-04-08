import { UsersService } from './users.service';
import { ActivatedRoute } from '@angular/router';
import { AuthState } from './../store/auth/auth.reducer';
import { Store, select } from '@ngrx/store';
import { BaseComponent } from './../shared/base.component';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../store/auth/auth.selectors';
import { UserViewModel } from './user-view-models';
import { UserRole } from './user';

export class ProfileBase extends BaseComponent {
  user: UserViewModel;
  private userId: string;
  private loggedInUser: UserViewModel;

  constructor(
    protected store: Store<AuthState>,
    protected route: ActivatedRoute,
    protected usersService: UsersService,
  ) {
    super();
    this.userId = route.snapshot.params.id;

    // when own profile
    store
      .pipe(
        takeUntil(this.destroyed$),
        select(userProfile),
        filter(x => !!x),
      )
      .subscribe(loggedInUser => {
        this.loggedInUser = loggedInUser;

        if (this.isOwnProfile) {
          this.user = loggedInUser;
        }
      });

    // when some random user profile and current user is admin
    if (!this.isOwnProfile) {
      this.usersService.loadUser(this.userId);
    }
  }

  get isOwnProfile(): boolean {
    return this.userId === this.loggedInUser.id;
  }

  get isEditAllowed(): boolean {
    return this.userId === this.loggedInUser.id || this.loggedInUser.role === UserRole.ADMIN;
  }
}
