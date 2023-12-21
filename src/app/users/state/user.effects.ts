import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, catchError, map, mergeMap, tap } from "rxjs";

import { UsersService } from "../users.service";
import { UserActions } from "./user.actions";

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService,
  ) { }

  getUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.GET_USER_LIST),
      mergeMap(() => this.usersService.getUsers()
        .pipe(
          map(users => ({ type: UserActions.SET_USER_LIST, users })),
          catchError(() => EMPTY)
        ))
    )}, { dispatch: true }
  );
}
