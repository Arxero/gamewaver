import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResetPasswordCmd } from './auth.models';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password-new.component.html',
  styleUrls: ['./forgotten-password.component.scss'],
})
export class ForgottenPasswordNewComponent implements OnInit {
  newPasswordForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private authService: AuthService,
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
    this.authService.resetPassword(resetPasswordCmd);
    this.dialogRef.close();
  }
}
