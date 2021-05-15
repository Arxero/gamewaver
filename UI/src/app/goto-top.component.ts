import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'gw-goto-top',
  template: `
    <button *ngIf="isShow" mat-mini-fab color="primary" class="goto-top" (click)="gotoTop()">
      <mat-icon>keyboard_arrow_up</mat-icon>
    </button>
  `,
  styleUrls: ['./app.component.scss'],
})
export class GotoTopComponent {
  isShow: boolean;
  topPosToStartShowing = 1000;

  @HostListener('window:scroll')
  checkScroll(): void {
    const scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  gotoTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
