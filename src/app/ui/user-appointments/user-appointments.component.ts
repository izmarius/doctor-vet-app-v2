import {Component, OnInit} from '@angular/core';
import {UserService} from "../user-profile/services/user.service";
import {USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {take} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {AnimalAppointmentService} from "../../services/animal-appointment/animal-appointment.service";
import {DoctorAppointmentsService} from "../services/doctor-appointments.service";

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
              private doctorAppointmentService: DoctorAppointmentsService) {
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
        this.doctorAppointmentService.cancelAnimalAppointmentByUser(appointment, null).then(() => {
          this.appointmentList = this.appointmentList.filter((app) => {
            return app.id !== appointment.id;
          });
        });
      }
    });
  }
}
