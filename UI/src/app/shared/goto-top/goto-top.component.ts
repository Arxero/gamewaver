import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-goto-top',
  templateUrl: './goto-top.component.html',
  styleUrls: ['./goto-top.component.scss'],
})
export class GotoTopComponent implements OnInit {
  isShow: boolean;
  topPosToStartShowing = 100;

  constructor() {}

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    console.log('[scroll]', scrollPosition);

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  ngOnInit(): void {}

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
