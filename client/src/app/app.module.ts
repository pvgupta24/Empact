import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationService } from './authentication.service';
import { EmotionService } from './emotion.service';

import { AuthGuardService } from './auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { CourseComponent } from './course/course.component';
import { RoomComponent } from './room/room.component';
import { BlobStorageService } from './blob-storage/blob-storage.service';
import { BlobModule } from 'angular-azure-blob-service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'room/:room', component: RoomComponent, canActivate: [AuthGuardService]  }
];

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BlobModule.forRoot()
  ],
  providers: [
    AuthenticationService, 
    AuthGuardService,
    EmotionService,
    BlobStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
