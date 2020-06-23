import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { User } from '../../users/models/dto/user';
import { takeUntil, filter } from 'rxjs/operators';
import { authState } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent extends BaseComponent implements OnInit {
  isLoggedIn: boolean;
  user: User;

  constructor(private store: Store<AuthState>) {
    super();

    store.pipe(
      takeUntil(this.destroyed$),
      select(authState),
      filter(x => !!x)
    ).subscribe(x => {
      this.isLoggedIn = x.isAuthenticated;
      this.user = x.profile;
    });
   }

  ngOnInit(): void {
  }

}
