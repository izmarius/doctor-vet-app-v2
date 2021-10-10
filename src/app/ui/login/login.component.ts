import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {AUTH_LOGIN_FORM_TEXT, INPUT_LABELS_TXT, INPUT_REGEX_TEXTS} from "../../shared-data/Constants";
import {FirebaseUtilsService} from "../../services/firebase-utils-service/firebase-utils.service";
import {LogInService} from "../../services/login/log-in.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public authFormGroup!: FormGroup;
  authText: any;
  dialogRef!: MatDialogRef<unknown>;

  constructor(private firebaseUtils: FirebaseUtilsService,
              private loginService: LogInService) {
  }

  ngOnInit(): void {
    this.authText = AUTH_LOGIN_FORM_TEXT;
    this.authText.labels = INPUT_LABELS_TXT;
    this.initAuthForm();
  }

  // authWithGoogle(): void {
  //   this.googleAuthEmitter.emit(true);
  // }

  emitCloseEvent(): void {
    this.dialogRef.close();
  }

  initAuthForm(): void {
    this.authFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(INPUT_REGEX_TEXTS.email)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onFormSubmit(): void {
    if (!this.authFormGroup.valid) {
      // this.uiAlert.setUiAlertMessage(new AlertDTO(AUTH_DATA.signUp.emailWarning, ALERT_STYLE_CLASS.error));
    } else if (!this.authFormGroup.valid && this.authFormGroup.controls.password.value.length < 6) {
      // this.uiAlert.setUiAlertMessage(new AlertDTO(AUTH_DATA.signUp.passwordLengthWarning, ALERT_STYLE_CLASS.error));
    } else {
      this.loginService.logIn(this.authFormGroup.controls.email.value, this.authFormGroup.controls.password.value);
    }
  }

  resetPassword(): void {
    // this.firebaseUtils.sendPasswordReset();
  }

  resendValidationEmail(): void {
  }
}
