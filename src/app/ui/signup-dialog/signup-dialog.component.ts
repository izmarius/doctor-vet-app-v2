import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {AUTH_SIGNUP_FORM_TEXT, COUNTIES, INPUT_LABELS_TXT, INPUT_REGEX_TEXTS} from '../../shared-data/Constants';
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
  counties!: string[];
  errorMessage: string = '';
  isAllowedToGoToFirstStep = true;
  isAllowedToGoToSecondStep = false;
  isAllowedToGoToThirdStep = false;
  isErrorMessage = false;
  isPhotoUploaded = true;
  photo!: string;
  secondStepGuide!: string[];
  selectedCounty!: string;
  private selectedServices: any = {};
  servicesUI: any;
  signupText: any;

  constructor(public dialogRef: MatDialogRef<SignupDialogComponent>,
              private firebaseUtils: FirebaseUtilsService,
              private signUpService: SignUpService) {
  }

  ngOnInit(): void {
    this.counties = COUNTIES;
    this.signupText = AUTH_SIGNUP_FORM_TEXT;
    this.signupText.labels = INPUT_LABELS_TXT;
    this.initAuthForm();
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
    this.authFormGroup = new FormGroup({
      email: new FormControl('pausan.ionut.adrian@gmail.com', [Validators.required, Validators.pattern(INPUT_REGEX_TEXTS.email)]),
      password: new FormControl('Start123', [Validators.required, Validators.minLength(6)]),
      phoneNumber: new FormControl('0743922689', [Validators.required, Validators.minLength(10), Validators.pattern(INPUT_REGEX_TEXTS.phoneNumber)]),
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
    // todo refactor here?
    if (this.isSignUpButtonDisabled()) {
      this.isErrorMessage = true;
      this.errorMessage = AUTH_SIGNUP_FORM_TEXT.selectAtLeastOneService;
      return;
    }
    this.isErrorMessage = false;
    this.signUpService.signUpDoctor(this.authFormGroup.controls.password.value, this.dialogRef, this.getDoctorDto());
  }

  goBackToPreviousStep(stepToGo: number) {
    if (stepToGo === 1) {
      this.isAllowedToGoToSecondStep = false;
      this.isAllowedToGoToFirstStep = true;
    } else if (stepToGo === 2) {
      this.isAllowedToGoToThirdStep = false;
      this.isAllowedToGoToSecondStep = true;
    }
  }

  getDoctorDto(): any {
    const doctor = new DoctorDTO();
    doctor.photoCertificate = this.photo;
    doctor.location = this.authFormGroup.controls.address.value;
    doctor.doctorName = this.authFormGroup.controls.name.value;
    doctor.phoneNumber = this.authFormGroup.controls.phoneNumber.value;
    doctor.email = this.authFormGroup.controls.email.value;
    doctor.services = this.selectedServices;
    // todo add also photo ulpad at sign up?
    doctor.photo = '';
    return doctor;
  }

  goToServicesStep(): void {
    this.servicesUI = DOCTOR_SERVICES;
    this.isAllowedToGoToThirdStep = true;
    this.isAllowedToGoToSecondStep = false;
  }

  toggleServiceSelection(serviceDesc: string, serviceKey: string): void {
    if (!this.selectedServices[serviceKey]) {
      this.selectedServices[serviceKey] = [serviceDesc];
    } else {
      if (this.selectedServices[serviceKey].indexOf(serviceDesc) !== -1) {
        this.selectedServices[serviceKey].splice(this.selectedServices[serviceKey].indexOf(serviceDesc), 1);
      } else {
        this.selectedServices[serviceKey].push(serviceDesc);
      }
    }
  }

  isFormCompleted(): boolean {
    return !this.authFormGroup.valid;
  }

  isSignUpButtonDisabled(): boolean {
    for(let service in this.selectedServices) {
      if(this.selectedServices[service].length > 0){
        return false;
      }
    }
    return true;
  }

  resendValidationEmail(): void {
    this.firebaseUtils.resendValidationEmail();
  }
}
