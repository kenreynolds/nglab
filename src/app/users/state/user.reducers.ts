import { createReducer, on } from "@ngrx/store";
import { ProfileInterface } from "src/app/app.model";
import { addUserState, modifyUserState, removeAllUserState, removeUserState, setUserList } from "./user.actions";

export interface UserState {
  users: ReadonlyArray<ProfileInterface>;
};

export const initialState: UserState = {
  users: [],
};

export const userReducer = createReducer(
  initialState,
  on(addUserState, (state, { user }) => {
    return {...state, users: [ ...state.users, user]}
  }),
  on(modifyUserState, (state, { user }) => {
    return {...state, users: state.users.map(data => data.id === user.id ? user : data)}
  }),
  on(removeAllUserState, (state) => {
    return {...state, users: []}
  }),
  on(removeUserState, (state, { userId }) => {
    return {...state, users: state.users.filter(data => data.id !== userId) }
  }),
  on(setUserList, (state, { users }) => {
    return {...state, users}
  }),
);
