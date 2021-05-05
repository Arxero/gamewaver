import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SentEmailDto } from './auth.models';

@Component({
  selector: 'gw-register-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Your Email</h2>
    <p>
      <markdown ngPreserveWhitespaces>
        {{ data.message }}
      </markdown>
    </p>
    <p>
      <markdown ngPreserveWhitespaces>
        Until you confirm your email you won't be able to login with username:
        **{{ data.username }}**.
      </markdown>
    </p>
  `,
})
export class RegisterConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: SentEmailDto) {}
}
