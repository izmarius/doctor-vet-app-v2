import {Component, OnInit} from '@angular/core';
import {AUTH_LOGIN_FORM_TEXT, INPUT_LABELS_TXT} from '../../shared-data/Constants';
import {LogInService} from "../../services/login/log-in.service";
import {FirebaseUtilsService} from "../../services/firebase-utils-service/firebase-utils.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  loginText: any;

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
              private firebaseUtils: FirebaseUtilsService,
              private loginService: LogInService) {
  }

  ngOnInit(): void {
    this.loginText = AUTH_LOGIN_FORM_TEXT;
    this.loginText.labels = INPUT_LABELS_TXT;
  }

  loginWithEmailAndPassword(loginPayload: any): void {
    // todo: validate inputs
    this.loginService.logIn(loginPayload.email, loginPayload.password, this.dialogRef);
  }

  resetPassword(): void {
    // this.firebaseUtils.sendPasswordReset();
  }
}
