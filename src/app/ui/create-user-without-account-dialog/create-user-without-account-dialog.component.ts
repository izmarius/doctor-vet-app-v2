import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {
  DOCTOR_CREATES_NEW_USER,
  INPUT_REGEX_TEXTS,
} from "../../shared-data/Constants";
import {UsersOfDoctorService} from "../../services/users-of-doctor/users-of-doctor.service";

@Component({
  selector: 'app-create-user-without-account-dialog',
  templateUrl: './create-user-without-account-dialog.component.html',
  styleUrls: ['./create-user-without-account-dialog.component.scss']
})
export class CreateUserWithoutAccountDialogComponent implements OnInit {

  doctorCreatesUserForm!: FormGroup;
  doctorCreatesUserText: any;
  isErrorDisplayed = false;
  errorMessage = '';

  constructor(public dialogRef: MatDialogRef<CreateUserWithoutAccountDialogComponent>,
              private uiAlertInterceptor: UiErrorInterceptorService,
              private usersDoctorsService: UsersOfDoctorService) {
  }

  ngOnInit(): void {
    this.doctorCreatesUserText = DOCTOR_CREATES_NEW_USER;
    this.initForm();
  }

  initForm() {
    this.doctorCreatesUserForm = new FormGroup({
      patientName: new FormControl(null, Validators.required),
      patientPhone: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.pattern(INPUT_REGEX_TEXTS.phoneNumber)]),
    });
  }

  onSubmitCreateUsersDoctors(): void {
    if (this.doctorCreatesUserForm.invalid) {
      this.errorMessage = DOCTOR_CREATES_NEW_USER.errorMessage;
      this.isErrorDisplayed = true;
    }
    this.isErrorDisplayed = false;
    this.errorMessage = '';

    const userDataPayload = {
      animals: [],
      name: this.doctorCreatesUserForm.controls.patientName.value,
      phone: this.doctorCreatesUserForm.controls.patientPhone.value,
    }

    const isUserAdded: any = this.usersDoctorsService.addUserToDoctorList(userDataPayload, false);
    if (isUserAdded) {
      this.dialogRef.close();
    }
  }

  onCancelForm(): void {
    this.dialogRef.close();
  }

}
