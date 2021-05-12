import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserGender, UpdateUserCmd } from './user';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from './users.service';
import { ProfileBase } from './profile.base';
import { UserInfo, UserInfoContext } from '../shared/user-info.component';

@Component({
  selector: 'gw-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent extends ProfileBase implements OnInit {
  editProfileForm: FormGroup;
  tempAvatar: string;
  userInfoContext = UserInfoContext;
  userGender = UserGender;

  constructor(route: ActivatedRoute, usersService: UsersService, authService: AuthService) {
    super(route, usersService, authService);

    // when we are editing other user profile
    usersService.user$.pipe(takeUntil(this.destroyed$)).subscribe(x => {
      this.user = x;
      this.editProfileForm.patchValue({
        email: x.email,
        avatar: x.avatar,
        summary: x.summary,
        location: x.location,
        gender: x.gender,
      });

      this.tempAvatar = this.user.avatar;
    });
  }

  get userInfo(): UserInfo {
    return {
      id: this.user.id,
      avatar: this.tempAvatar,
      username: this.user.username,
    };
  }

  ngOnInit(): void {
    this.initializeData();
    this.avatar.valueChanges.subscribe(x => {
      this.tempAvatar = x;
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
    this.tempAvatar = this.user?.avatar;
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

  onSave() {
    const updateUserCmd: UpdateUserCmd = {
      email: this.email.value,
      avatar: this.avatar.value,
      gender: this.gender.value,
      location: this.location.value,
      summary: this.summary.value,
    };
    this.usersService.edit(updateUserCmd, this.user.id, this.isOwnProfile);
  }

  onCancel() {
    this.authService.cancelEdit(this.user.id);
  }
}
