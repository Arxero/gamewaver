import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthState } from '../store/auth/auth.reducer';
import { RegisterAction } from '../store/auth/auth.actions';
import { EnvironmentService } from '../services/environment.service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { SignUpCmd } from './auth.models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  @ViewChild('captchaRef') captchaRef: RecaptchaComponent;

  get siteKey() {
    return this.environmentService.reCaptchaSiteKey;
  }

  constructor(
    private store: Store<AuthState>,
    private environmentService: EnvironmentService,
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.email,
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
      confirm: new FormControl(null, [
        Validators.required,
        x => this.confirmPasswordValidator(x),
      ]),
      termsAgree: new FormControl(null, [Validators.requiredTrue]),
    });
  }

  confirmPasswordValidator(c: AbstractControl): { [key: string]: boolean } {
    const value = c.value;
    if (value !== this.password?.value) {
      return { confirmPasswordValidator: true };
    }

    return null;
  }

  get username() {
    return this.registerForm.get('username');
  }
  get password() {
    if (!this.registerForm) {
      return;
    }
    return this.registerForm.get('password');
  }
  get confirm() {
    return this.registerForm.get('confirm');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get termsAgree() {
    return this.registerForm.get('termsAgree');
  }

  onRegister() {
    this.captchaRef.execute();
  }

  resolved(captchaResponse: string) {
    const signUpCmd: SignUpCmd = {
      username: this.username.value,
      email: this.email.value,
      password: this.password.value,
      reCaptchaaToken: captchaResponse,
    };
    this.store.dispatch(new RegisterAction({ signUpCmd }));
  }
}
