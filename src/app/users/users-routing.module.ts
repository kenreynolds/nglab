import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddUserComponent } from "./components/add-user/add-user.component";
import { EditProfileComponent } from "./components/edit-profile/edit-profile.component";
import { UsersListComponent } from "./components/users-list/users-list.component";

const routes: Routes = [
  { path: '', component: UsersListComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'user/:id', component: EditProfileComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
