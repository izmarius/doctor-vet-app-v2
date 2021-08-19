import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LogInService} from "../../../services/login/log-in.service";
import {NAVBAR_TEXT, USER_LOCALSTORAGE} from "../../../shared-data/Constants";
import {DoctorAppointmentModalComponent} from "../../doctor-appointment-modal/doctor-appointment-modal.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  navbarText: any;
  user: any;
  isUserLoggedIn!: boolean;

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
      if(result) {

      }
    });
  }

  setHiddenNavLinks(): void {
    if (localStorage.getItem(USER_LOCALSTORAGE)) {
      this.isUserLoggedIn = true;
    }
  }

  signOut(): void {
    this.loginService.signOut();
    this.isUserLoggedIn = false;
  }
}
