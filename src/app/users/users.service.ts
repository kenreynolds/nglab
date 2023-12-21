import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileInterface } from '../app.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  baseApi = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // POST data
  addNewUserData(newUserData: ProfileInterface) {
    return this.http.post(`${this.baseApi}/users`, newUserData);
  }

  // DELETE data
  deleteUserData(userId: any) {
    return this.http.delete(`${this.baseApi}/users/${userId}`);
  }

  // GET data
  getUsersData() {
    return this.http.get(`${this.baseApi}/users`);
  }

  // PUT Data
  updateUserData(updatedUserData: ProfileInterface) {
    return this.http.put(`${this.baseApi}/users/${updatedUserData.id}`, updatedUserData);
  }
}
