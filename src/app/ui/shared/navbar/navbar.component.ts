import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LogInService} from "../../../services/login/log-in.service";
import {NAVBAR_TEXT, USER_LOCALSTORAGE} from "../../../shared-data/Constants";
import {DoctorAppointmentModalComponent} from "../../doctor-appointment-modal/doctor-appointment-modal.component";
import {CreateUserDialogComponent} from "../../create-user-dialog/create-user-dialog.component";
import {UserAppointmentDialogComponent} from "../../user-appointment/user-appointment.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  navbarText: any;
  user: any;
  isUserLoggedIn = false;
  isDoctorLoggedIn = false;

  constructor(private dialog: MatDialog,
              private loginService: LogInService) {
  }

  ngOnInit(): void {
    this.setHiddenNavLinks();
    this.navbarText = NAVBAR_TEXT;
  }

  openAppointmentsModal(): void {
    const dialogRef = this.dialog.open(DoctorAppointmentModalComponent, {
      height: '40rem',
      panelClass: 'doctor-appointment-dialog',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  openCreateUserDialog(): void {
    this.dialog.open(CreateUserDialogComponent, {
      minWidth: '20%',
      minHeight: '10rem',
      panelClass: 'doctor-appointment-dialog',
    });
  }

  setHiddenNavLinks(): void {
    const user: any = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    if (user && user.doctorName) {
      this.isDoctorLoggedIn = true;
    } else if (user && user.name) {
      this.isUserLoggedIn = true;
    }
  }

  signOut(): void {
    this.loginService.signOut();
    this.isUserLoggedIn = false;
    this.isDoctorLoggedIn = false;
  }
}
