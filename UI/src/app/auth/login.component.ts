import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginCmd } from './auth.models';
import { AuthService } from './auth.service';

@Component({
  selector: 'gw-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<LoginComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      rememberMe: new FormControl(true, [Validators.required]),
    });

    if (this.data) {
      this.snackBar.open(`${this.data}`, 'CLOSE', {
        duration: 5000,
      });
    }
  }

  get username(): AbstractControl {
    return this.loginForm.get('username');
  }
  get password(): AbstractControl {
    return this.loginForm.get('password');
  }
  get rememberMe(): AbstractControl {
    return this.loginForm.get('rememberMe');
  }

  onAction(): void {
    this.dialogRef.close();
  }

  onLogin(): void {
    const loginCmd: LoginCmd = {
      username: this.username.value,
      password: this.password.value,
    };
    this.authService.login(loginCmd, this.data ? true : false);
    this.onAction();
  }
}
