import {Component, OnInit} from '@angular/core';
import {APPOINTMENT_MESSAGES, MODALS_DATA, UI_ALERTS_CLASSES} from "../../shared-data/Constants";
import {take} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {DoctorAppointmentsService} from "../services/doctor-appointments.service";
import {DoctorService} from "../../services/doctor/doctor.service";
import {AppointmentsService} from "../../services/appointments/appointments.service";
import {UserAppointmentsService} from "../../services/user-appointments/user-appointments.service";
import {IAppointmentDto} from "../../services/appointments/appointment-dto";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";

@Component({
  selector: 'app-user-appointments',
  templateUrl: './user-appointments.component.html',
  styleUrls: ['./user-appointments.component.scss']
})
export class UserAppointmentsComponent implements OnInit {
  appointmentList: IAppointmentDto[] | null = [];

  constructor(private appointmentService: AppointmentsService,
              private dialogRef: MatDialog,
              private doctorAppointmentService: DoctorAppointmentsService,
              private doctorService: DoctorService,
              private uiAlertService: UiErrorInterceptorService,
              private userAppointmentsService: UserAppointmentsService) {
  }

  ngOnInit(): void {
    this.getAllAppointments();
  }

  getAllAppointments(): void {
    this.userAppointmentsService.userAppointmentsObs$.subscribe((appointments) => {
      this.appointmentList = appointments;
    })
  }

  cancelAppointmentByUser(appointment: IAppointmentDto): void {
    if(appointment.timestamp < new Date().getTime()) {
      this.uiAlertService.setUiError({
        message: APPOINTMENT_MESSAGES.CANCEL_APPOINTMENT_IN_PAST_NOT_POSSIBLE,
        class: UI_ALERTS_CLASSES.ERROR
      });
      return;
    }
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
                  // @ts-ignore
                  this.appointmentList = this.appointmentList.filter((app) => {
                    return app.id !== appointment.id;
                  });
                });
            });
        }
      });
  }
}
