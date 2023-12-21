import { createReducer, on } from "@ngrx/store";
import { ProfileInterface } from "src/app/app.model";
import { setUserList } from "./user.actions";

export interface UserState {
  users: ReadonlyArray<ProfileInterface>;
};

export const initialState: UserState = {
  users: [],
};

export const userReducer = createReducer(
  initialState,
  on(setUserList, (state, { users }) => { return {...state, users}}),
);
