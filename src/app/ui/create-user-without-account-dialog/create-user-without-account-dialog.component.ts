import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {UserService} from "../user-profile/services/user.service";
import {
  DOCTOR_CREATES_NEW_USER,
  INPUT_REGEX_TEXTS,
  USER_LOCALSTORAGE,
  USERS_DOCTORS
} from "../../shared-data/Constants";
import {UsersOfDoctorService} from "../../services/users-of-doctor/users-of-doctor.service";
import {UsersDoctorsListService} from "../../services/usersDoctorsObservableService/usersDoctorsListService";

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
  doctor: any;

  constructor(public dialogRef: MatDialogRef<CreateUserWithoutAccountDialogComponent>,
              private uiAlertInterceptor: UiErrorInterceptorService,
              private usersDoctorsService: UsersOfDoctorService,
              private usersDoctorsListService: UsersDoctorsListService) {
    this.doctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
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
      clientPhone: this.doctorCreatesUserForm.controls.patientPhone.value,
      clientName: this.doctorCreatesUserForm.controls.patientName.value,
      isClientRegisteredInApp: false,
      doctorName: this.doctor.doctorName,
      doctorId: this.doctor.id
    }

    // todo check for user to be authenticated
    this.usersDoctorsService.addUserToDoctorList(userDataPayload).then((res) => {
      const usersList = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));
      usersList.push(userDataPayload);
      localStorage.removeItem(USERS_DOCTORS);
      localStorage.setItem(USERS_DOCTORS, JSON.stringify(usersList));
      this.usersDoctorsListService.setUsersDoctorList(usersList);
      this.dialogRef.close();
    }).catch((error) => {
      console.error("ERROR:", error);
    });
  }

  onCancelForm(): void {
    this.dialogRef.close();
  }

}
