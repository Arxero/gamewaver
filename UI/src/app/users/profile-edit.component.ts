import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { UserGender, UpdateUserCmd } from './user';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from './users.service';
import { ProfileBase } from './profile.base';

@Component({
  selector: 'app-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent extends ProfileBase implements OnInit {
  editProfileForm: FormGroup;

  constructor(route: ActivatedRoute, usersService: UsersService, authService: AuthService) {
    super(route, usersService, authService);

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
    this.usersService.edit(updateUserCmd, this.user.id, this.isOwnProfile);
  }
}
