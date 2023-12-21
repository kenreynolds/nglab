import { createAction, props } from "@ngrx/store";
import { ProfileInterface } from "src/app/app.model";

export enum UserActions {
  GET_USER_LIST = '[User] Get User list',
  SET_USER_LIST = '[User] Set User list',
  ADD_USER_API = '[User] Add User (API)',
  ADD_USER_STATE = '[User] Add User (STATE)',
  MODIFY_USER_API = '[User] Modify User (API)',
  MODIFY_USER_STATE = '[User] Modify User (STATE)',
  REMOVE_USER_API = '[User] Remove User (API)',
  REMOVE_USER_STATE = '[User] Remove User (STATE)',
  REMOVE_ALL_USER_API = '[User] Remove All User (API)',
  REMOVE_ALL_USER_STATE = '[User] Remove All User (STATE)',
}

export const getUserList = createAction(
  UserActions.GET_USER_LIST,
);

export const setUserList = createAction(
  UserActions.SET_USER_LIST,
  props<{ users: ReadonlyArray<ProfileInterface> }>(),
);

export const addUserState = createAction(
  UserActions.ADD_USER_STATE,
  props<{ user: ProfileInterface }>(),
);

export const modifyUserState = createAction(
  UserActions.MODIFY_USER_STATE,
  props<{ user: ProfileInterface }>(),
);

export const removeUserState = createAction(
  UserActions.REMOVE_USER_STATE,
  props<{ userId: string }>(),
);

export const removeAllUserState = createAction(
  UserActions.REMOVE_ALL_USER_STATE
);
