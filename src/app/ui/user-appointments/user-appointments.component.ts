import {Component, OnInit} from '@angular/core';
import {UserService} from "../user-profile/services/user.service";
import {USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {take} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-user-appointments',
  templateUrl: './user-appointments.component.html',
  styleUrls: ['./user-appointments.component.scss']
})
export class UserAppointmentsComponent implements OnInit {
  user: any;
  appointmentList: any[] = [];

  constructor(private userService: UserService,
              private dialogRef: MatDialog) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.user = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
      this.getAllAppointments(this.user);
    }, 300)

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

  cancelAppointment(appointment: any): void {

    const dialogRef = this.dialogRef.open(ConfirmDialogComponent, {
      panelClass: 'confirmation-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {

        // delete user appointment and update doctor appointment
      }
    });
  }
}
