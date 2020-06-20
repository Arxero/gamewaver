import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ForgotPasswordCmd } from '../models/cmd/forgot-password.cmd';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import {
  ForgotPasswordAction,
  ResetPasswordAction,
} from '../../store/auth/auth.actions';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResetPasswordCmd } from '../models/cmd/reset-password.cmd';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password-new.component.html',
  styleUrls: ['./forgotten-password.component.scss'],
})
export class ForgottenPasswordNewComponent implements OnInit {
  newPasswordForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private store: Store<AuthState>,
    private dialogRef: MatDialogRef<ForgottenPasswordNewComponent>,
  ) {}

  ngOnInit(): void {
    this.newPasswordForm = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
    });
  }

  get password() {
    return this.newPasswordForm.get('password');
  }

  onSubmit() {
    const resetPasswordCmd: ResetPasswordCmd = {
      password: this.password.value,
      token: this.data,
    };
    this.store.dispatch(new ResetPasswordAction({ resetPasswordCmd }));
    this.dialogRef.close();
  }
}
