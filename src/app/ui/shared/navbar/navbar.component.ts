import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LogInService} from "../../../services/login/log-in.service";
import {NAVBAR_TEXT} from "../../../shared-data/Constants";
import {LoginDialogComponent} from "../../login-dialog/login-dialog.component";
import {SignupDialogComponent} from "../../signup-dialog/signup-dialog.component";

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

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '22%',
      height: '27.5rem',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isUserLoggedIn = true;
      }
    });
  }

  openSignupDialog(): void {
    const dialogRef = this.dialog.open(SignupDialogComponent, {
      width: '26%',
      minHeight: '28.125rem',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
    });
  }

  setHiddenNavLinks(): void {
    if (localStorage.getItem('user')) {
      this.isUserLoggedIn = true;
    }
  }

  signOut(): void {
    this.loginService.signOut();
    this.isUserLoggedIn = false;
  }
}
