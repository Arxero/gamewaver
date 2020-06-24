import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  opened = true;
  mode = 'side';

  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
      if (result.matches) {
        this.opened = false;
        this.mode = 'over';
      } else {
        this.opened = true;
        this.mode = 'side';
      }
    });
  }

  ngOnInit(): void {}

  onToggle() {
    this.sidenav.toggle();
    this.opened = !this.opened;
  }
}
