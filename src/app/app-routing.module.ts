import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from './ui/home-page/home-page.component';
import {DoctorAppointmentsComponent} from "./ui/doctor-appointments/doctor-appointments.component";
import {MyProfileComponent} from "./ui/my-profile/my-profile.component";
import {DoctorScheduleComponent} from "./ui/doctor-schedule/doctor-schedule.component";
import {LoginComponent} from "./ui/login/login.component";
import {SignupComponent} from "./ui/signup/signup.component";
import {SignUpChoiceComponent} from "./ui/sign-up-choice/sign-up-choice.component";
import {SignUpUserComponent} from "./ui/sign-up-user/sign-up-user.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'schedule', component: DoctorScheduleComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignUpChoiceComponent},
  {path: 'signup-doctor', component: SignupComponent},
  {path: 'signup-user', component: SignUpUserComponent},
  {path: 'profile', component: MyProfileComponent},
  {path: 'appointments', component: DoctorAppointmentsComponent},
  {path: 'home', component: HomePageComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
