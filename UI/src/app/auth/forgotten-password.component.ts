import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ForgotPasswordAction } from '../store/auth/auth.actions';
import { ForgotPasswordCmd } from './auth.models';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-forgotten-password',
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

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit() {
    const forgotPasswordCmd: ForgotPasswordCmd = {
      email: this.email.value,
    };
    this.authService.forgotPassword(forgotPasswordCmd);
  }
}
