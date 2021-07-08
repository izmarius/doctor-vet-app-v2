import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {AUTH_SIGNUP_FORM_TEXT, COUNTIES, INPUT_LABELS_TXT} from '../../shared-data/Constants';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FirebaseUtilsService} from "../../services/firebase-utils-service/firebase-utils.service";
import {SignUpService} from "../../services/signup/sign-up.service";
import {DoctorDTO} from "../../data/model-dto/doctor-DTO";
import {DOCTOR_SERVICES} from "../../shared-data/DoctorServicesConstants";

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent implements OnInit {
  authFormGroup!: FormGroup;
  signupText: any;
  counties!: string[];
  isAllowedToGoToSecondStep!: boolean;
  isAllowedToGoToFirstStep = true;
  isErrorMessage!: boolean;
  isPhotoUploaded = true;
  photo!: string;
  secondStepGuide!: string[];
  selectedCounty!: string;
  isAllowedToGoToThirdStep = false;
  services: any;
  private selectedServices: string[] = [];

  constructor(public dialogRef: MatDialogRef<SignupDialogComponent>,
              private firebaseUtils: FirebaseUtilsService,
              private signUpService: SignUpService) {
  }

  ngOnInit(): void {
    this.counties = COUNTIES;
    this.signupText = AUTH_SIGNUP_FORM_TEXT;
    this.signupText.labels = INPUT_LABELS_TXT;
    this.initAuthForm();
    this.goToServicesStep();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  setCounty(value: any): void {
    this.selectedCounty = value;
  }

  getUploadedImage(base64Image: any): void {
    this.photo = base64Image;
    this.isPhotoUploaded = false;
  }

  initAuthForm(): void {
    const emailPattern = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$';
    const phonePattern = '^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$';
    this.authFormGroup = new FormGroup({
      email: new FormControl('pausan.ionut.adrian@gmail.com', [Validators.required, Validators.pattern(emailPattern)]),
      password: new FormControl('Start123', [Validators.required, Validators.minLength(6)]),
      phoneNumber: new FormControl('0743922689', [Validators.required, Validators.minLength(10), Validators.pattern(phonePattern)]),
      name: new FormControl('ionu', Validators.required),
      address: new FormControl('Cluj-Napoca, 5', Validators.required),
    });
  }

  firstStepOnFormSubmit(): void {
    if (!this.authFormGroup.valid) {
      this.isErrorMessage = true;
    } else {
      this.isAllowedToGoToFirstStep = false;
      this.isErrorMessage = false;
      this.secondStepGuide = AUTH_SIGNUP_FORM_TEXT.secondStepText.split(';');
      this.isAllowedToGoToSecondStep = true;
    }
  }

  signupWithEmailAndPassword(): void {
    this.signUpService.signUpDoctor(this.authFormGroup.controls.password.value, this.dialogRef, this.getDoctorDto());
  }

  getDoctorDto(): any {
    const doctor = new DoctorDTO();
    doctor.photoCertificate = this.photo;
    doctor.location = this.selectedCounty + ', ' + this.authFormGroup.controls.address.value;
    doctor.doctorName = this.authFormGroup.controls.name.value;
    doctor.phoneNumber = this.authFormGroup.controls.phoneNumber.value;
    doctor.email = this.authFormGroup.controls.email.value;
    return doctor;
  }

  goToServicesStep(): void {
    this.services = DOCTOR_SERVICES;
    this.isAllowedToGoToThirdStep = true;
    this.isAllowedToGoToSecondStep = false;
  }
  toggleServiceSelection(serviceDesc: string): void {
      if(this.selectedServices.indexOf(serviceDesc) !== -1) {
        this.selectedServices.splice(this.selectedServices.indexOf(serviceDesc), 1);
      } else {
        this.selectedServices.push(serviceDesc);
      }
  }

  resendValidationEmail(): void {
    this.firebaseUtils.resendValidationEmail();
  }
}
