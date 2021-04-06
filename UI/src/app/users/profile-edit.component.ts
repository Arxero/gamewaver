import { Component, OnInit } from '@angular/core';
import { User, UserGender, UpdateUserCmd } from './user';
import { BaseComponent } from '../shared/base.component';
import { Store, select } from '@ngrx/store';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../store/auth/auth.selectors';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { EditUserAction, GetUserAction, ClearProfileUserAction } from '../store/users/users.actions';
import { UsersState } from '../store/users/users.reducer';
import { ActivatedRoute } from '@angular/router';
import { usersStateProfileUser } from '../store/users/users.selectors';
import { UserViewModel } from './user-view-models';
import { UsersService } from './users.service';

@Component({
  selector: 'app-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent extends BaseComponent implements OnInit {
  user: UserViewModel;
  editProfileForm: FormGroup;
  userId: string;
  loggedInUserId: string;

  constructor(private store: Store<UsersState>, private route: ActivatedRoute, private usersService: UsersService) {
    super();
    this.userId = this.route.snapshot.params.id;

    // when own profile
    store
      .pipe(
        takeUntil(this.destroyed$),
        select(userProfile),
        filter(x => !!x),
      )
      .subscribe(loggedInUser => {
        this.user = loggedInUser;
        this.loggedInUserId = loggedInUser.id;
      });

    // when some random user profile and current user is admin
    if (!this.isOwnProfile()) {
      usersService.loadUser(this.userId);
    }

    usersService.user$.pipe(takeUntil(this.destroyed$)).subscribe(x => {
      this.user = x;
      this.editProfileForm.patchValue({
        email: x.email,
        avatar: x.avatar,
        summary: x.summary,
        location: x.location,
        gender: x.gender,
      });
    });
  }

  ngOnInit(): void {
    this.initializeData();
    this.avatar.valueChanges.subscribe(x => {
      this.user.avatar = x || window.location.origin + this.user.defaultAvatar;
    });
  }

  initializeData() {
    this.editProfileForm = new FormGroup({
      email: new FormControl(this.user?.email, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.email,
      ]),

      avatar: new FormControl(this.user?.avatar),
      summary: new FormControl(this.user?.summary),
      location: new FormControl(this.user?.location),
      gender: new FormControl(this.user?.gender),
    });
  }

  get email() {
    return this.editProfileForm.get('email');
  }
  get avatar() {
    return this.editProfileForm.get('avatar');
  }
  get summary() {
    return this.editProfileForm.get('summary');
  }
  get location() {
    return this.editProfileForm.get('location');
  }
  get gender() {
    return this.editProfileForm.get('gender');
  }
  get userGender() {
    return UserGender;
  }

  onSave() {
    const updateUserCmd: UpdateUserCmd = {
      email: this.email.value,
      avatar: this.user.avatar,
      gender: this.gender.value,
      location: this.location.value,
      summary: this.summary.value,
    };
    this.usersService.editUser(this.userId, updateUserCmd, this.isOwnProfile());
  }

  onDestroy() {
    this.usersService.clear();
  }

  private isOwnProfile(): boolean {
    return this.userId === this.loggedInUserId;
  }
}
