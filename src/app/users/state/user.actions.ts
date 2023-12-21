import { createAction, props } from "@ngrx/store";
import { ProfileInterface } from "src/app/app.model";

export enum UserActions {
  GET_USER_LIST = '[User] Get User list',
  SET_USER_LIST = '[User] Set User list',
}

export const getUserList = createAction(
  UserActions.GET_USER_LIST,
);

export const setUserList = createAction(
  UserActions.SET_USER_LIST,
  props<{ users: ReadonlyArray<ProfileInterface> }>(),
);