import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';


import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { GoalsModule } from './goals/goals.module';
import {AuthModule} from '../app/auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { TaskModule } from './tasks/task.module';
import { CalendarComponentModule} from './calendar/calendar.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    GoalsModule,
    AuthModule,
    ProfileModule,
    TaskModule,
    CalendarComponentModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true},
    {provide: HTTP_INTERCEPTORS,useClass:ErrorInterceptor,multi:true}
  ],

  bootstrap: [AppComponent],
  entryComponents:[ErrorComponent]
})
export class AppModule { }
