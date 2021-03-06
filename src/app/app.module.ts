import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AngularFireFunctionsModule, USE_EMULATOR as  FUNCTIONS_EMULATOR} from '@angular/fire/functions';
import { AngularFireDatabaseModule, USE_EMULATOR as DB_EMULATOR} from '@angular/fire/database';
import { AngularFireAuthModule, USE_EMULATOR as AUTH_EMULATOR} from '@angular/fire/auth';
import { AngularFirestoreModule, AngularFirestore, USE_EMULATOR as FIRE_EMULATOR} from '@angular/fire/firestore';
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
import { ArticleSectionStepsComponent } from './ui/shared/article-section-steps/article-section-steps.component';
import { ArticleSectionTextComponent } from './ui/shared/article-section-text/article-section-text.component';
import { HeaderComponent } from './ui/shared/header/header.component';
import { TextCardComponent } from './ui/shared/text-card/text-card.component';
import { CreateUserDialogComponent } from './ui/create-user-dialog/create-user-dialog.component';
import { SignUpChoiceComponent } from './ui/sign-up-choice/sign-up-choice.component';
import { SignUpUserComponent } from './ui/sign-up-user/sign-up-user.component';
import { MyAnimalsComponent } from './ui/my-animals/my-animals.component';
import { AnimalFormComponent } from './ui/my-animals/animal-form/animal-form.component';
import { UserAppointmentsComponent } from './ui/user-appointments/user-appointments.component';
import { UserAppointmentCardComponent } from './ui/shared/user-appointment-card/user-appointment-card.component';
import { UserAppointmentDialogComponent } from './ui/user-appointment/user-appointment.component';
import { DropdownComponent } from './ui/shared/dropdown/dropdown.component';
import {HttpClientModule} from "@angular/common/http";
import { UserCreateAppCardComponent } from './ui/shared/user-create-app-card/user-create-app-card.component';
import {AppCalendarModule} from "./ui/calendar/app-calendar-module";
import { DoctorAppointmentWithoutUserModalComponent } from './ui/doctor-appointment-without-user-modal/doctor-appointment-without-user-modal.component';
import { UserWithoutAccountDetailsCardComponent } from './ui/user-without-account-details-card/user-without-account-details-card.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UsersOfDoctorPageComponent } from './ui/users-of-doctor-page/users-of-doctor-page.component';
import { SidebarComponent } from './ui/shared/sidebar/sidebar.component';
import { CreateUserWithoutAccountDialogComponent } from './ui/create-user-without-account-dialog/create-user-without-account-dialog.component';

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
    ArticleSectionStepsComponent,
    ArticleSectionTextComponent,
    HeaderComponent,
    TextCardComponent,
    CreateUserDialogComponent,
    SignUpChoiceComponent,
    SignUpUserComponent,
    MyAnimalsComponent,
    AnimalFormComponent,
    UserAppointmentsComponent,
    UserAppointmentCardComponent,
    UserAppointmentDialogComponent,
    DropdownComponent,
    UserCreateAppCardComponent,
    DoctorAppointmentWithoutUserModalComponent,
    UserWithoutAccountDetailsCardComponent,
    UsersOfDoctorPageComponent,
    SidebarComponent,
    CreateUserWithoutAccountDialogComponent,
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
    HttpClientModule,
    AppCalendarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
