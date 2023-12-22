import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileInterface } from '../app.model';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  baseApi = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // POST data
  addUser(user: ProfileInterface) {
    return this.http
      .post<ProfileInterface>(`${this.baseApi}/users`, user)
      .pipe(
        tap((data: ProfileInterface) => data),
        catchError(err => throwError(() => err))
      );
  }

  // DELETE data
  deleteUserData(id: any) {
    return this.http
      .delete<ProfileInterface>(`${this.baseApi}/users/${id}`)
      .pipe(
        catchError(err => throwError(() => err))
      );
  }

  // GET data
  getUsers(): Observable<ProfileInterface[]> {
    return this.http
      .get<ProfileInterface[]>(`${this.baseApi}/users`)
      .pipe(
        tap((data: ProfileInterface[]) => data),
        catchError(err => throwError(() => err))
      );
  }

  // PUT Data
  updateUser(id: number, user: ProfileInterface) {
    return this.http
      .put<ProfileInterface>(`${this.baseApi}/users/${id}`, user)
      .pipe(
        catchError(err => throwError(() => err))
      );
  }
}
