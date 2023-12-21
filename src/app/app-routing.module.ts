import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './users/components/add-user/add-user.component';
import { EditProfileComponent } from './users/components/edit-profile/edit-profile.component';
import { UsersComponent } from './users/components/users/users.component';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'add-user', component: AddUserComponent },
  { path: 'user/:id', component: EditProfileComponent },
  { path: 'users', component: UsersComponent },
  { path: '**', redirectTo: 'users' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
