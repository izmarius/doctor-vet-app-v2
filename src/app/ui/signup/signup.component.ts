import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SignUpService} from "../../services/signup/sign-up.service";
import {
  AUTH_SIGNUP_FORM_TEXT,
  COUNTIES, COUNTIES_ABBR,
  DOCTOR_DEFAULT_SCHEDULE, FREQUENCY_MINUTES_INTERVALS,
  INPUT_LABELS_TXT,
  INPUT_REGEX_TEXTS
} from "../../shared-data/Constants";
import {DoctorDTO} from "../../data/model-dto/doctor-DTO";
import {DOCTOR_SERVICES} from "../../shared-data/DoctorServicesConstants";
import {LocationService} from "../../services/location-service/location.service";
import {LoaderService} from "../../services/loader/loader.service";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  authFormGroup!: FormGroup;
  counties!: any[];
  countiesAbbr!: any;
  localities!: string[];
  locality: string = '';
  errorMessage: string = '';
  isAllowedToGoToFirstStep = true;
  isAllowedToGoToThirdStep = false;
  isErrorMessage = false;
  selectedCounty: string = '';
  private selectedServices: any = {};
  servicesObjectsForDoctor: any;
  signupText: any;

  constructor(private signUpService: SignUpService,
              private locationService: LocationService,
              private loaderService: LoaderService) {
  }

  ngOnInit(): void {
    this.counties = COUNTIES;
    this.countiesAbbr = COUNTIES_ABBR;
    this.signupText = AUTH_SIGNUP_FORM_TEXT;
    this.signupText.labels = INPUT_LABELS_TXT;
    this.initAuthForm();
  }

  clickFirstStepOnFormSubmit(): void {
    if (this.isFormBtnDisabled()) {
      this.isErrorMessage = true;
    } else {
      this.isAllowedToGoToFirstStep = false;
      this.isErrorMessage = false;
      this.goToServicesStep();
    }
  }

  initAuthForm(): void {
    this.authFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(INPUT_REGEX_TEXTS.email)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(INPUT_REGEX_TEXTS.phoneNumber)]),
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
    });
  }

  getDoctorDto(): any {
    const doctor = new DoctorDTO();
    doctor.location = this.authFormGroup.controls.address.value;
    doctor.county = this.selectedCounty;
    doctor.locality = this.locality;
    doctor.doctorName = this.authFormGroup.controls.name.value;
    doctor.phoneNumber = this.authFormGroup.controls.phoneNumber.value;
    doctor.email = this.authFormGroup.controls.email.value;
    doctor.services = this.selectedServices;
    doctor.photo = '';
    doctor.unavailableTime = {};
    doctor.schedule = DOCTOR_DEFAULT_SCHEDULE;
    doctor.appointmentFrequency = {
      minuteIntervals: FREQUENCY_MINUTES_INTERVALS['30'],
      hourIntervals: [9, 10, 11, 12, 13, 14, 15, 16, 17]
    }
    doctor.appointmentInterval = 30;
    doctor.appointmentsMap = {}
    return doctor;
  }

  goBackToPreviousStep(stepToGo: number) {
    if (stepToGo === 1) {
      this.isAllowedToGoToThirdStep = false;
      this.isAllowedToGoToFirstStep = true;
    }
  }

  goToServicesStep(): void {
    this.servicesObjectsForDoctor = DOCTOR_SERVICES;
    this.isAllowedToGoToThirdStep = true;
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

  isFormBtnDisabled(): boolean {
    // @ts-ignore
    return !this.authFormGroup.valid || !this.selectedCounty || !this.locality;
  }

  isSignUpButtonDisabled(): boolean {
    for (let service in this.selectedServices) {
      if (this.selectedServices[service].length > 0) {
        return false;
      }
    }
    return true;
  }

  setCountyAndSetLocalities(value: any): void {
    this.selectedCounty = value;
    this.loaderService.show();
    this.locationService.getCitiesByCountyCode(this.countiesAbbr[value])
      .pipe(finalize(() => this.loaderService.hide()))
      .subscribe((response: any) => {
        this.localities = response
      }, error => {
        // this.uiAlertMessageService.setUiError({message:})
        console.log(error);
      });
  }

  setLocality(locality: string): void {
    this.locality = locality;
  }

  signupWithEmailAndPasswordAndRegisterDoctor(): void {
    if (this.isSignUpButtonDisabled()) {
      this.isErrorMessage = true;
      this.errorMessage = AUTH_SIGNUP_FORM_TEXT.selectAtLeastOneService;
      return;
    }
    this.isErrorMessage = false;
    this.signUpService.signUpDoctor(this.authFormGroup.controls.password.value, this.getDoctorDto());
  }
}
