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
  GetUserActionSuccess,
  GetUserActionFailure,
  GetUserAction,
} from './users.actions';
import { UsersState } from './users.reducer';
import { UsersService } from '../../services/users.service';
import { GetUserInfoAction } from '../auth/auth.actions';
import { SnackbarService } from '../../services/snackbar.service';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    private router: Router,
    private snackbarService: SnackbarService,
    private store: Store<UsersState>,
  ) {}

  // EDIT USER
  @Effect({ dispatch: false })
  editUser$ = this.actions$.pipe(
    ofType<EditUserAction>(UsersActionTypes.EditUserAction),
    tap(async a => {
      try {
        const user = await this.usersService.update(
          a.payload.id,
          a.payload.updateUserCmd,
        );
        this.store.dispatch(new EditUserActionSuccess({ user }));
      } catch (error) {
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  editUserSuccess$ = this.actions$.pipe(
    ofType<EditUserActionSuccess>(UsersActionTypes.EditUserActionSuccess),
    tap(a => {
      this.store.dispatch(new GetUserInfoAction());
      this.router.navigate(['/users/profile']);
      this.snackbarService.showInfo('Edit Profile Successfull');
    }),
  );

  @Effect({ dispatch: false })
  editUserFailure$ = this.actions$.pipe(
    ofType<EditUserActionFailure>(UsersActionTypes.EditUserActionFailure),
    map(() => {}),
  );

  // GET USER
  @Effect({ dispatch: false })
  getUser$ = this.actions$.pipe(
    ofType<GetUserAction>(UsersActionTypes.GetUserAction),
    tap(async a => {
      try {
        const { result } = await this.usersService.findOne(a.payload.id);
        this.store.dispatch(new GetUserActionSuccess({ user: result }));
      } catch (error) {
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  getUserSuccess$ = this.actions$.pipe(
    ofType<GetUserActionSuccess>(UsersActionTypes.GetUserActionSuccess),
    tap(a => {}),
  );

  @Effect({ dispatch: false })
  getUserFailure$ = this.actions$.pipe(
    ofType<GetUserActionFailure>(UsersActionTypes.GetUserActionFailure),
    map(() => {}),
  );
}
