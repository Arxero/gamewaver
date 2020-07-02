import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { takeUntil, filter } from 'rxjs/operators';
import { authState, userProfile } from '../../store/auth/auth.selectors';
import { User } from '../models/dto/user';
import { cloneDeep } from 'lodash';
import { MarkdownComponent } from 'ngx-markdown';
import { ActivatedRoute } from '@angular/router';
import { usersInPosts } from '../../store/home/home.selectors';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {
  user: User;

  constructor(
    private store: Store<AuthState>,
    private route: ActivatedRoute) {
    super();
    const userId = this.route.snapshot.params.id;

    store.pipe(
      takeUntil(this.destroyed$),
      select(userProfile),
      filter(x => !!x)
    ).subscribe(x => {
      this.user = cloneDeep(x);
    });

    store.pipe(
      takeUntil(this.destroyed$),
      select(usersInPosts),
      filter(x => !!x)
    ).subscribe(x => {
      const userFromId = x.find(u => u.id === userId);
      this.user = userId ? cloneDeep(userFromId) : this.user;
    });
   }



  ngOnInit(): void {
  }

}
