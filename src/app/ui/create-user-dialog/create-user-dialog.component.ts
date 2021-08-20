import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DOCTOR_CREATES_NEW_USER, INPUT_REGEX_TEXTS} from "../../shared-data/Constants";
import {MatDialogRef} from "@angular/material/dialog";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss']
})
export class CreateUserDialogComponent implements OnInit {
  doctorCreatesUserForm!: FormGroup;
  doctorCreatesUserText: any;
  constructor(public dialogRef: MatDialogRef<CreateUserDialogComponent>,
              private uiAlertInterceptor: UiErrorInterceptorService) { }

  ngOnInit(): void {
    this.doctorCreatesUserText = DOCTOR_CREATES_NEW_USER;
    this.initForm();
  }

  initForm() {
    this.doctorCreatesUserForm = new FormGroup({
      patientName: new FormControl(null, Validators.required),
      animalName: new FormControl(null),
      patientPhone: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.pattern(INPUT_REGEX_TEXTS.phoneNumber)]),
      patientEmail: new FormControl(null, [Validators.required, Validators.pattern(INPUT_REGEX_TEXTS.email)]),
    });
  }

  onSubmitCreateUser(): void {
    // create user with email and password(passwordless?)
    //create animal if exists!
  }

  onCancelForm(): void {
    this.dialogRef.close();
  }
}
