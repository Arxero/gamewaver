import { Component, OnInit } from '@angular/core';
import { Profile } from '../../shared/models/Profile';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { takeUntil, filter } from 'rxjs/operators';
import { userProfile } from '../../store/auth/auth.selectors';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';


@Component({
  selector: 'app-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent extends BaseComponent implements OnInit {
  user: Profile;
  editProfileForm: FormGroup;

  constructor(private store: Store<AuthState>) {
    super();

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(userProfile),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.user = cloneDeep(x);
      });
  }

  ngOnInit(): void {
    this.editProfileForm = new FormGroup({
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.email,
      ]),

      avatar: new FormControl(this.user.avatar),
      summary: new FormControl(this.user.summary),
      location: new FormControl(this.user.location),
      gender: new FormControl(this.user.gender),
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

  onSave() {
    // const signUpCmd: SignUpCmd = {
    //   username: this.username.value,
    //   email: this.email.value,
    //   password: this.password.value,
    // };
    // this.store.dispatch(new RegisterAction({ signUpCmd }));
  }
}
