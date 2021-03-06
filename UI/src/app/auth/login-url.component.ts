import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LoginComponent } from './login.component';

@Component({
  selector: 'gw-login-url',
  template: '',
})
export class LoginUrlComponent implements OnInit {
  isEmailConfirmed: boolean;

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.isEmailConfirmed = params.emailConfirmed;
    });
  }

  ngOnInit(): void {
    this.dialog.open(LoginComponent, {
      data: this.isEmailConfirmed ? 'Email Confirmed Successfully' : null,
    });
  }
}
