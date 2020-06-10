import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { LoginAction } from '../../store/auth/auth.actions';
import { LoginCmd } from '../models/cmd/login.cmd';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<LoginComponent>,
    private store: Store<AuthState>,
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      rememberMe: new FormControl(true, [Validators.required]),
    });
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
    this.store.dispatch(new LoginAction({ loginCmd }));
    this.onAction();
  }
}
