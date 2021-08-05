import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {INPUT_REGEX_TEXTS} from "../../../shared-data/Constants";

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit {
  public authFormGroup!: FormGroup;
  @Input() authText: any;
  @Input() dialogRef!: MatDialogRef<unknown>;
  @Input() isGoogleAuth!: boolean;
  @Output() emailVerificationEmitter = new EventEmitter();
  @Output() emailPasswordEmitter = new EventEmitter();
  @Output() forgotPasswordEmitter = new EventEmitter();
  @Output() googleAuthEmitter = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
    this.initAuthForm();
  }

  authWithGoogle(): void {
    this.googleAuthEmitter.emit(true);
  }

  emitCloseEvent(): void {
    this.dialogRef.close();
  }

  initAuthForm(): void {
    this.authFormGroup = new FormGroup({
      email: new FormControl('pausan.ionut.adrian@gmail.com', [Validators.required, Validators.pattern(INPUT_REGEX_TEXTS.email)]),
      password: new FormControl('Start123', [Validators.required, Validators.minLength(6)]),
    });
  }

  onFormSubmit(): void {
    if (!this.authFormGroup.valid) {
      // this.uiAlert.setUiAlertMessage(new AlertDTO(AUTH_DATA.signUp.emailWarning, ALERT_STYLE_CLASS.error));
    } else if (!this.authFormGroup.valid && this.authFormGroup.controls.password.value.length < 6) {
      // this.uiAlert.setUiAlertMessage(new AlertDTO(AUTH_DATA.signUp.passwordLengthWarning, ALERT_STYLE_CLASS.error));
    } else {
      this.emailPasswordEmitter.emit({
        email: this.authFormGroup.controls.email.value,
        password: this.authFormGroup.controls.password.value
      });
    }
  }

  resetPassword(): void {
    this.forgotPasswordEmitter.emit(true);
  }

  resendValidationEmail(): void {
    this.emailVerificationEmitter.emit(true);
  }
}
