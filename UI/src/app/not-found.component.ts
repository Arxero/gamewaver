import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div style="text-align: center; padding: 50px;">
      <h1>404</h1>
      <h3>Page Not Found! 😕</h3>
      <p>You seem to be trying to find this way to home</p>
      <a mat-raised-button color="primary" [routerLink]="['/']">Back to home</a>
    </div>
  `,
})
export class NotFoundComponent {}
