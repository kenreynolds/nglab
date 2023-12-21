import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./user.reducers";

// Select the UserState
export const selectUserState = createFeatureSelector<UserState>('userState');

// Select all users
export const selectUsers: any = () => createSelector(selectUsers, (state: UserState) => state.users);

// Select a user based on id
export const selectUser = (id: number) => createSelector(
  selectUserState,
  (state: UserState) => state.users.find(d => d.id === id)
);
