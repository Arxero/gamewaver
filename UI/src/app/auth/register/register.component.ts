import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { EnvironmentService } from 'src/app/shared/services/environment.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private environmentService: EnvironmentService) {
    console.log(this.environmentService.apiUrl);
  }

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
}