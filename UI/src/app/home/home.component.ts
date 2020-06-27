import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BaseComponent } from '../shared/base.component';
import { Store, select } from '@ngrx/store';
import { HomeState } from '../store/home/home.reducer';
import { takeUntil, filter } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { GetPostDto } from './models/dto/get-post.dto';
import { homeStatePosts } from '../store/home/home.selectors';
import { GetPostsAction } from '../store/home/home.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent extends BaseComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  opened = true;
  mode = 'side';
  posts: GetPostDto[];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<HomeState>,
  ) {
    super();
    breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
      if (result.matches) {
        this.opened = false;
        this.mode = 'over';
      } else {
        this.opened = true;
        this.mode = 'side';
      }
    });

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(homeStatePosts),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.posts = x;
      });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetPostsAction());
  }

  onToggle() {
    this.sidenav.toggle();
    this.opened = !this.opened;
  }
}
