import {Component, OnInit} from '@angular/core';
import {MODALS_DATA, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {take} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {DoctorAppointmentsService} from "../services/doctor-appointments.service";
import {DoctorService} from "../../services/doctor/doctor.service";
import {AppointmentsService} from "../../services/appointments/appointments.service";

@Component({
  selector: 'app-user-appointments',
  templateUrl: './user-appointments.component.html',
  styleUrls: ['./user-appointments.component.scss']
})
export class UserAppointmentsComponent implements OnInit {
  user: any;
  appointmentList: any[] = [];

  constructor(private appointmentService: AppointmentsService,
              private dialogRef: MatDialog,
              private doctorAppointmentService: DoctorAppointmentsService,
              private doctorService: DoctorService) {
  }

  ngOnInit(): void {
    this.user = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.getAllAppointments(this.user);
  }

  getAllAppointments(userData: any): void {
    this.appointmentService.getAllCurrentUserAppointments(userData)
      .pipe(take(1))
      .subscribe((appointments) => {
        this.appointmentList = appointments;
      });
  }

  cancelAppointmentByUser(appointment: any): void {
    const dialogRef = this.dialogRef.open(ConfirmDialogComponent, {
      panelClass: MODALS_DATA.CONFIRMATION_MODAL
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        if (result) {
          this.doctorService.getDoctorById(appointment.doctorId)
            .pipe(take(1))
            .subscribe((doctor: any) => {
              this.appointmentService.cancelAnimalAppointmentByUser(appointment, doctor)
                .then(() => {
                  this.appointmentList = this.appointmentList.filter((app) => {
                    return app.id !== appointment.id;
                  });
                });
            });
        }
      });
  }
}
