import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../shared/base.component';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/auth/auth.reducer';
import { User } from '../../users/models/dto/user';
import { takeUntil, filter } from 'rxjs/operators';
import { authState } from '../../store/auth/auth.selectors';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreatePostComponent extends BaseComponent implements OnInit {
  isLoggedIn: boolean;
  user: User;
  postForm: FormGroup;

  constructor(private store: Store<AuthState>) {
    super();

    store
      .pipe(
        takeUntil(this.destroyed$),
        select(authState),
        filter(x => !!x),
      )
      .subscribe(x => {
        this.isLoggedIn = x.isAuthenticated;
        this.user = x.profile;
      });
  }

  ngOnInit(): void {
    this.postForm = new FormGroup({
      content: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(5000),
      ]),
    });
  }

  get content() {
    return this.postForm.get('content');
  }

  onPost() {
  }
}
