import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { userReducer } from './state/user.reducers';
import { UserEffects } from './state/user.effects';

import { AddUserComponent } from './components/add-user/add-user.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { AlertsComponent } from '../shared/alerts/alerts.component';
import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [
    AddUserComponent,
    AlertsComponent,
    EditProfileComponent,
    UsersListComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatExpansionModule,
    StoreModule.forFeature('userState', userReducer),
    EffectsModule.forFeature([UserEffects]),
  ]
})
export class UsersModule { }