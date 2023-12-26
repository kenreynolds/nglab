import { createReducer, on } from "@ngrx/store";
import { User } from "../models/user.interface";
import { addUserState, modifyUserState, removeAllUserState, removeUserState, setUserList } from "./user.actions";

export interface UserState {
  users: ReadonlyArray<User>;
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
