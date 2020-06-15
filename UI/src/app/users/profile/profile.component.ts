import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { takeUntil, filter } from 'rxjs/operators';
import { authState, userProfile } from '../../store/auth/auth.selectors';
import { Profile } from '../../shared/models/Profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent implements OnInit {
  user: Profile;

  constructor(private store: Store<AuthState>) {
    super();

    store.pipe(
      takeUntil(this.destroyed$),
      select(userProfile),
      filter(x => !!x)
    ).subscribe(x => {
      this.user = x;
    });
   }

  ngOnInit(): void {
  }

}
