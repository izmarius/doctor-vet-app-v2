import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from './ui/home-page/home-page.component';
import {DoctorAppointmentsComponent} from "./ui/doctor-appointments/doctor-appointments.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
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
