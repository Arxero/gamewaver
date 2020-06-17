import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import {
  EditUserAction,
  UsersActionTypes,
  EditUserActionSuccess,
  EditUserActionFailure,
} from './users.actions';
import { UsersState } from './users.reducer';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    // private authservice: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store<UsersState>,
  ) {}

  @Effect({ dispatch: false })
  register$ = this.actions$.pipe(
    ofType<EditUserAction>(UsersActionTypes.EditUserAction),
    tap(async a => {
      try {
        // const accessToken = await this.authservice.register(a.payload.signUpCmd);
        // this.store.dispatch(new RegisterActionSuccess({ accessToken }));
      } catch (error) {
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  registerSuccess$ = this.actions$.pipe(
    ofType<EditUserActionSuccess>(UsersActionTypes.EditUserActionSuccess),
    tap(a => {
      this.router.navigate(['/user/profile']);
      this.snackBar.open('Edit profile successfull', 'CLOSE', {
        duration: 2000,
      });
    }),
  );

  @Effect({ dispatch: false })
  registerFailure$ = this.actions$.pipe(
    ofType<EditUserActionFailure>(UsersActionTypes.EditUserActionFailure),
    map(() => {}),
  );
}
