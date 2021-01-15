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
import { usersProfileFullRoute } from '../../users/users.routing';
import { LoadingService } from '../../services/loading.service';
import { mapUserViewModel } from '../../users/user-view-models';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    private router: Router,
    private snackbarService: SnackbarService,
    private store: Store<UsersState>,
    private loadingService: LoadingService,
  ) {}

  // EDIT USER
  @Effect({ dispatch: false })
  editUser$ = this.actions$.pipe(
    ofType<EditUserAction>(UsersActionTypes.EditUserAction),
    tap(async a => {
      try {
        this.loadingService.setUILoading();
        const { result } = await this.usersService.update(
          a.payload.id,
          a.payload.updateUserCmd,
        );
        this.store.dispatch(new EditUserActionSuccess({ user: result }));
      } catch (error) {
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  editUserSuccess$ = this.actions$.pipe(
    ofType<EditUserActionSuccess>(UsersActionTypes.EditUserActionSuccess),
    tap(a => {
      this.loadingService.setUILoading(false);
      this.store.dispatch(new GetUserInfoAction());
      this.router.navigate([usersProfileFullRoute() + `/${a.payload.user.id}`]);
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
        this.loadingService.setUILoading();
        const { result } = await this.usersService.findOne(a.payload.id);
        const mappedUser = mapUserViewModel(result);
        this.store.dispatch(new GetUserActionSuccess({ user: mappedUser }));
      } catch (error) {
        console.log(error);
      }
    }),
  );

  @Effect({ dispatch: false })
  getUserSuccess$ = this.actions$.pipe(
    ofType<GetUserActionSuccess>(UsersActionTypes.GetUserActionSuccess),
    tap(a => {
      this.loadingService.setUILoading(false);
    }),
  );

  @Effect({ dispatch: false })
  getUserFailure$ = this.actions$.pipe(
    ofType<GetUserActionFailure>(UsersActionTypes.GetUserActionFailure),
    map(() => {}),
  );
}
