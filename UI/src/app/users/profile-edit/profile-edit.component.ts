import { Component, OnInit } from '@angular/core';
import { User, UserGender } from '../models/dto/user';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../../store/auth/auth.selectors';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { UpdateUserCmd } from '../models/cmd/update-user.cmd';
import { EditUserAction, GetUserAction } from '../../store/users/users.actions';
import { UsersState } from '../../store/users/users.reducer';
import { ActivatedRoute } from '@angular/router';
import { usersStateProfileUser } from '../../store/users/users.selectors';

@Component({
  selector: 'app-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent extends BaseComponent implements OnInit {
  user: User;
  editProfileForm: FormGroup;

  constructor(private store: Store<UsersState>, private route: ActivatedRoute) {
    super();
    const userId = this.route.snapshot.params.id;

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(userProfile),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.user = cloneDeep(x);
      });

    if (userId) {
      this.store.dispatch(new GetUserAction({ id: userId }));

      store
        .pipe(
          takeUntil(this.destroyed$),
          select(usersStateProfileUser),
          filter(x => !!x),
        )
        .subscribe(x => {
          this.user = cloneDeep(x);
        });
    }
  }

  ngOnInit(): void {
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

    this.avatar.valueChanges.subscribe(x => {
      this.user.avatar = x;
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
      avatar: this.avatar.value,
      gender: this.gender.value,
      location: this.location.value,
      summary: this.summary.value,
    };
    this.store.dispatch(
      new EditUserAction({ id: this.user.id, updateUserCmd }),
    );
  }
}
