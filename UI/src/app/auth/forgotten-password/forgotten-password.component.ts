import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ForgotPasswordCmd } from '../models/cmd/forgot-password.cmd';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { ForgotPasswordAction } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.scss'],
})
export class ForgottenPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;

  constructor(private store: Store<AuthState>) {}

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
    this.store.dispatch(new ForgotPasswordAction({ forgotPasswordCmd }));
  }
}
