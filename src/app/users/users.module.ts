import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { userReducer } from './state/user.reducers';
import { UserEffects } from './state/user.effects';

import { MaterialModule } from '../material/material.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersListComponent } from './components/users-list/users-list.component';
import { AlertsComponent } from '../shared/alerts/alerts.component';
import { FormComponent } from './pages/form/form.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { ListComponent } from './pages/list/list.component';


@NgModule({
  declarations: [
    AlertsComponent,
    UsersListComponent,
    FormComponent,
    UserFormComponent,
    ListComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    StoreModule.forFeature('userState', userReducer),
    EffectsModule.forFeature([UserEffects]),
  ]
})
export class UsersModule { }
