import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForgottenPasswordComponent } from './forgotten-password.component';
import { Router, ActivatedRoute } from '@angular/router';
import { loginRoute, forgottenPasswordRoute } from './auth.routing';
import { ForgottenPasswordNewComponent } from './forgotten-password-new.component';

@Component({
  selector: 'app-forgotten-password-url',
  template: ``,
})
export class ForgottenPasswordUrlComponent implements OnInit {
  resetPasswordToken: boolean;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.resetPasswordToken = params.resetPasswordToken;
    });

    if (this.resetPasswordToken) {
      this.dialog.open(ForgottenPasswordNewComponent, {
        data: this.resetPasswordToken,
      });
    } else {
      this.dialog.open(ForgottenPasswordComponent);
    }

    this.dialog.afterAllClosed.subscribe(() => {
      if (this.router.url.includes('forgotten-password')) {
        this.router.navigate(['auth/login']);
      }
    });
  }
}
