import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { HomePageComponent } from './ui/home-page/home-page.component';
import { LoginComponent } from './ui/login/login.component';
import { SignupComponent } from './ui/signup/signup.component';
import { FooterComponent } from './ui/shared/footer/footer.component';
import { NavbarComponent } from './ui/shared/navbar/navbar.component';
import {AppRoutingModule} from "./app-routing.module";
import {LoginDialogComponent} from "./ui/login-dialog/login-dialog.component";
import MaterialModule from "./material-module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AuthDialogComponent} from "./ui/shared/auth-dialog/auth-dialog.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SignupDialogComponent} from "./ui/signup-dialog/signup-dialog.component";
import {AppComponent} from "./app.component";
import { UploadPhotoComponent } from './ui/shared/upload-photo/upload-photo.component';
import { DoctorAppointmentsComponent } from './ui/doctor-appointments/doctor-appointments.component';
import { UserCardComponent } from './ui/shared/user-card/user-card.component';
import { UserAnimalInfoComponent } from './ui/user-animal-info/user-animal-info.component';
import { UserProfileComponent } from './ui/user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginComponent,
    SignupComponent,
    FooterComponent,
    NavbarComponent,
    LoginDialogComponent,
    AuthDialogComponent,
    SignupDialogComponent,
    UploadPhotoComponent,
    DoctorAppointmentsComponent,
    UserCardComponent,
    UserAnimalInfoComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireFunctionsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
