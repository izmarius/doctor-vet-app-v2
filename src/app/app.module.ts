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
import MaterialModule from "./material-module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppComponent} from "./app.component";
import { UploadPhotoComponent } from './ui/shared/upload-photo/upload-photo.component';
import { DoctorAppointmentsComponent } from './ui/doctor-appointments/doctor-appointments.component';
import { UserCardComponent } from './ui/shared/user-card/user-card.component';
import { UserAnimalInfoComponent } from './ui/user-animal-info/user-animal-info.component';
import { UserProfileComponent } from './ui/user-profile/user-profile.component';
import { DoctorAppointmentModalComponent } from './ui/doctor-appointment-modal/doctor-appointment-modal.component';
import { SectionTitleSubtitleComponent } from './ui/shared/section-title-subtitle/section-title-subtitle.component';
import { ConfirmDialogComponent } from './ui/shared/confirm-dialog/confirm-dialog.component';
import { MyProfileComponent } from './ui/my-profile/my-profile.component';
import { PhotoTextComponent } from './ui/my-profile/photo-text/photo-text.component';
import { DoctorScheduleComponent } from './ui/doctor-schedule/doctor-schedule.component';
import { ScheduleSetterComponent } from './ui/doctor-schedule/schedule-setter/schedule-setter.component';
import { AdjustableHeaderComponent } from './ui/shared/adjustable-header/adjustable-header.component';
import { AlertMessageComponent } from './ui/shared/alert-message/alert-message.component';
import { FeatureArticlesComponent } from './ui/feature-articles/feature-articles.component';
import { FeaturesSectionComponent } from './ui/features-section/features-section.component';
import { FeaturesComponent } from './ui/features/features.component';
import { ArticleSectionStepsComponent } from './ui/shared/article-section-steps/article-section-steps.component';
import { ArticleSectionTextComponent } from './ui/shared/article-section-text/article-section-text.component';
import { HeaderComponent } from './ui/shared/header/header.component';
import { TextCardComponent } from './ui/shared/text-card/text-card.component';
import { CreateUserDialogComponent } from './ui/create-user-dialog/create-user-dialog.component';

@NgModule({
  entryComponents: [AlertMessageComponent],
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginComponent,
    SignupComponent,
    FooterComponent,
    NavbarComponent,
    UploadPhotoComponent,
    DoctorAppointmentsComponent,
    UserCardComponent,
    UserAnimalInfoComponent,
    UserProfileComponent,
    DoctorAppointmentModalComponent,
    SectionTitleSubtitleComponent,
    ConfirmDialogComponent,
    MyProfileComponent,
    PhotoTextComponent,
    DoctorScheduleComponent,
    ScheduleSetterComponent,
    AdjustableHeaderComponent,
    AlertMessageComponent,
    FeatureArticlesComponent,
    FeaturesSectionComponent,
    FeaturesComponent,
    ArticleSectionStepsComponent,
    ArticleSectionTextComponent,
    HeaderComponent,
    TextCardComponent,
    CreateUserDialogComponent,
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
