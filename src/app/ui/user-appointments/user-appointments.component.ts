import {Component, OnInit} from '@angular/core';
import {UserService} from "../user-profile/services/user.service";
import {USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {take} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {DoctorAppointmentsService} from "../services/doctor-appointments.service";
import {DoctorService} from "../../services/doctor/doctor.service";

@Component({
  selector: 'app-user-appointments',
  templateUrl: './user-appointments.component.html',
  styleUrls: ['./user-appointments.component.scss']
})
export class UserAppointmentsComponent implements OnInit {
  user: any;
  appointmentList: any[] = [];

  constructor(private userService: UserService,
              private dialogRef: MatDialog,
              private doctorAppointmentService: DoctorAppointmentsService,
              private doctorService: DoctorService) {
  }

  ngOnInit(): void {
    this.user = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.getAllAppointments(this.user);
  }

  getAllAppointments(userData: any): void {
    this.userService.getAllCurrentUserAppointments(userData)
      .pipe(take(1))
      .subscribe((snaps) => {
        snaps.docs.forEach((doc: any) => {
          this.appointmentList.push(doc.data())
        });
      });
  }

  cancelAppointmentByUser(appointment: any): void {
    const dialogRef = this.dialogRef.open(ConfirmDialogComponent, {
      panelClass: 'confirmation-modal'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doctorService.getDoctorById(appointment.doctorId)
          .pipe(take(1))
          .subscribe((doctor: any) => {
            this.doctorAppointmentService.cancelAnimalAppointmentByUser(appointment, doctor).then(() => {
              this.appointmentList = this.appointmentList.filter((app) => {
                return app.id !== appointment.id;
              });
            });
          });
      }
    });
  }
}
