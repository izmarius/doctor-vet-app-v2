import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from './ui/home-page/home-page.component';
import {MyProfileComponent} from "./ui/my-profile/my-profile.component";
import {DoctorScheduleComponent} from "./ui/doctor-schedule/doctor-schedule.component";
import {LoginComponent} from "./ui/login/login.component";
import {SignupComponent} from "./ui/signup/signup.component";
import {SignUpChoiceComponent} from "./ui/sign-up-choice/sign-up-choice.component";
import {SignUpUserComponent} from "./ui/sign-up-user/sign-up-user.component";
import {MyAnimalsComponent} from "./ui/my-animals/my-animals.component";
import {UserAppointmentsComponent} from "./ui/user-appointments/user-appointments.component";
import {UserAppointmentDialogComponent} from "./ui/user-appointment/user-appointment.component";
import {CalendarComponent} from "./ui/calendar/calendar.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'schedule', component: DoctorScheduleComponent},
  {path: 'my-animals', component: MyAnimalsComponent},
  {path: 'my-appointments', component: UserAppointmentsComponent},
  {path: 'new-appointment', component: UserAppointmentDialogComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignUpChoiceComponent},
  {path: 'signup-doctor', component: SignupComponent},
  {path: 'signup-user', component: SignUpUserComponent},
  {path: 'profile', component: MyProfileComponent},
  {path: 'calendar', component: CalendarComponent},
  {path: 'home', component: HomePageComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
