import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DOCTOR_CREATES_NEW_USER, INPUT_REGEX_TEXTS} from "../../shared-data/Constants";
import {MatDialogRef} from "@angular/material/dialog";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {UserService} from "../user-profile/services/user.service";
import {IUsersDoctors} from "../../services/users-of-doctor/users-doctors-interface";
import {IUserDTO} from "../user-profile/dto/user-dto";

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss']
})
export class CreateUserDialogComponent implements OnInit {
  doctorCreatesUserForm!: FormGroup;
  doctorCreatesUserText: any;
  isErrorDisplayed = false;
  errorMessage = '';

  constructor(public dialogRef: MatDialogRef<CreateUserDialogComponent>,
              private uiAlertInterceptor: UiErrorInterceptorService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.doctorCreatesUserText = DOCTOR_CREATES_NEW_USER;
    this.initForm();
  }

  initForm() {
    this.doctorCreatesUserForm = new FormGroup({
      patientName: new FormControl(null, Validators.required),
      animalName: new FormControl(null, Validators.required),
      patientPhone: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.pattern(INPUT_REGEX_TEXTS.phoneNumber)]),
      patientEmail: new FormControl(null, [Validators.required, Validators.pattern(INPUT_REGEX_TEXTS.email)]),
    });
  }

  onSubmitCreateUser(): void {
    if (this.doctorCreatesUserForm.invalid) {
      this.errorMessage = DOCTOR_CREATES_NEW_USER.errorMessage;
      this.isErrorDisplayed = true;
    }
    this.isErrorDisplayed = false;
    this.errorMessage = '';

    const userDataPayload = this.userService.getUserPayload(
      this.doctorCreatesUserForm.controls.animalName.value,
      null,
      '-',
      this.doctorCreatesUserForm.controls.patientEmail.value,
      this.doctorCreatesUserForm.controls.patientName.value,
      this.doctorCreatesUserForm.controls.patientPhone.value,
      ''
    )

    this.userService.createUserByDoctorAuthAndSaveAnimal(userDataPayload, this.dialogRef);
  }
}
