import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ForgotPasswordCmd } from './auth.models';
import { AuthService } from './auth.service';

@Component({
  selector: 'gw-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.scss'],
})
export class ForgottenPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.email,
      ]),
    });
  }

  get email(): AbstractControl {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit(): void {
    const forgotPasswordCmd: ForgotPasswordCmd = {
      email: this.email.value,
    };
    this.authService.forgotPassword(forgotPasswordCmd);
  }
}
