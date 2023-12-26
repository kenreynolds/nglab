import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { EMPTY, catchError, forkJoin, map, mergeMap, tap } from "rxjs";
import { UsersService } from "../services/users.service";
import { UserActions } from "./user.actions";
import { User } from "../models/user.interface";

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private usersService: UsersService,
  ) { }

  // Add users to the database
  addUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.ADD_USER_API),
      mergeMap((data: { type: string, payload: User}) => this.usersService.addUser(data.payload)
        .pipe(
          map(users => ({ type: UserActions.ADD_USER_STATE, user: data.payload })),
          tap(() => this.router.navigate(['users'])),
          catchError(() => EMPTY)
      ))
    )}, { dispatch: true }
  );

  // Delete user from the database
  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.REMOVE_USER_API),
      mergeMap((data: { type: number, payload: number }) => this.usersService.deleteUserData(data.payload)
        .pipe(
          map(() => ({ type: UserActions.REMOVE_USER_STATE, userId: data.payload })),
          catchError(() => EMPTY)
      ))
    )}, { dispatch: true }
  );

  // Delete all users from the database
  deleteUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.REMOVE_ALL_USER_API),
      mergeMap((data: { type: number, payload: number[] }) =>
      forkJoin([...data.payload.map((id) => this.usersService.deleteUserData(id))])
        .pipe(
          map(() => ({ type: UserActions.REMOVE_ALL_USER_STATE })),
          catchError(() => EMPTY)
        ))
      )}, { dispatch: true }
  );

  // Get a list of users from the external API
  // Set the retrieved users list in state
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

  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.MODIFY_USER_API),
      mergeMap((data: { type: number, payload: User}) => this.usersService.updateUser(
        data.payload.id, data.payload
      ).pipe(
        map(users => ({ type: UserActions.MODIFY_USER_STATE, user: data.payload })),
        tap(() => this.router.navigate(['users'])),
        catchError(() => EMPTY)
      ))
    )}, { dispatch: true }
  );
}
