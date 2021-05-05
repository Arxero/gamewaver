import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
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

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  onAction() {
    this.dialogRef.close();
  }

  onLogin() {
    const loginCmd: LoginCmd = {
      username: this.username.value,
      password: this.password.value,
    };
    this.authService.login(loginCmd, this.data ? true : false);
    this.onAction();
  }
}
