// import { DoctorAppointmentsComponent } from './ui/doctor-appointments/doctor-appointments.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { DoctorAppointmentComponent } from './ui/doctor-appointment/doctor-appointment.component';
// import { AppoitmentFormComponent } from './ui/shared/appoitment-form/appoitment-form.component';
// import {DoctorScheduleComponent} from './ui/doctor-schedule/doctor-schedule.component';
// import {MyProfileComponent} from './ui/my-profile/my-profile.component';
import {HomePageComponent} from './ui/home-page/home-page.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  // {path: 'calendar', component: DoctorAppointmentComponent},
  // {path: 'appointment-form', component: AppoitmentFormComponent},
  // {path: 'appointments', component: DoctorAppointmentsComponent},
  // {path: 'profile', component: MyProfileComponent},
  // {path: 'schedule', component: DoctorScheduleComponent},
  {path: 'home', component: HomePageComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
