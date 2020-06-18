import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { takeUntil, filter } from 'rxjs/operators';
import { authState, userProfile } from '../../store/auth/auth.selectors';
import { User } from '../models/dto/user';
import { cloneDeep } from 'lodash';
import { MarkdownComponent } from 'ngx-markdown';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {
  user: User;

  constructor(private store: Store<AuthState>) {
    super();

    store.pipe(
      takeUntil(this.destroyed$),
      select(userProfile),
      filter(x => !!x)
    ).subscribe(x => {
      this.user = cloneDeep(x);
    });
   }

  ngOnInit(): void {
  }

}
