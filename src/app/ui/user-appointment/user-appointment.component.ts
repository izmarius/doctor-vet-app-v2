import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {APPOINTMENTFORM_DATA, COUNTIES, COUNTIES_ABBR, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {DoctorService} from "../../services/doctor/doctor.service";
import {LocationService} from "../../services/location-service/location.service";
import {AnimalUtilInfo} from "../dto/animal-util-info";
import {FirestoreService} from "../../data/http/firestore.service";
import {DoctorsAppointmentDTO} from "../dto/doctor-appointments-dto";
import {DoctorAppointmentsService} from "../services/doctor-appointments.service";
import {AnimalAppointmentService} from "../../services/animal-appointment/animal-appointment.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";

@Component({
  selector: 'app-user-appointment',
  templateUrl: './user-appointment.component.html',
  styleUrls: ['./user-appointment.component.scss']
})
export class UserAppointmentDialogComponent implements OnInit {
  userAppointmentFormText: any;
  countiesAbbr: any;
  stepMinutes: any = [0, 15, 30, 45];
  stepMinute: number = this.stepMinutes[0];
  stepHours: any = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  stepHour: number = this.stepHours[0];
  isErrorDisplayed = false;
  formErrorMessage = '';
  errorMessage = '';
  public minDate = new Date();
  counties!: string[];
  county!: string;
  localities!: string[];
  locality!: string;
  isSearchByUserSuccess = false;
  isSearchByUserSuccessAndEmpty = false;
  doctorList !: any[];
  user: any;
  selectedAnimal: any;
  isAnimalSelected: any;
  isUserWithoutAnimal = false

  constructor(private dateTimeUtils: DateUtilsService,
              private doctorService: DoctorService,
              private locationService: LocationService,
              private firestoreService: FirestoreService,
              private doctorAppointmentService: DoctorAppointmentsService,
              private animalAppointmentService: AnimalAppointmentService,
              private uiAlertInterceptor: UiErrorInterceptorService
  ) {
  }

  ngOnInit(): void {
    this.counties = COUNTIES;
    this.countiesAbbr = COUNTIES_ABBR;
    this.userAppointmentFormText = APPOINTMENTFORM_DATA;
    this.user = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.errorMessage = 'Pentru a crea o programare te rugam sa iti adaugi un animal in sectiunea "Animalele mele -> Adauga animale"';
    this.setDefaultAnimalAndCheckIfUserHasAnimals();
  }

  setDefaultAnimalAndCheckIfUserHasAnimals(): void {
    this.selectedAnimal = this.user.animals && this.user.animals.length > 0 ? this.user.animals[0] : {};
    if (Object.entries(this.selectedAnimal).length === 0) {
      this.isUserWithoutAnimal = true;
    }
  }

  createAppointment(doctorDetails: any): void {
    if (!this.isTimeValid(doctorDetails)) {
      return;
    }

    if (this.isAppointmentDataInvalid(doctorDetails)) {
      this.uiAlertInterceptor.setUiError({
        message: 'Selecteaza toate datele de pe card pentru a creea o programare',
        class: 'snackbar-error'
      });
      return;
    }

    const newAnimalInfo = new AnimalUtilInfo()
      .setName(this.selectedAnimal.animalName)
      .setUid(this.selectedAnimal.animalId);

    const doctorAppointmentId = this.firestoreService.getNewFirestoreId();
    const animalAppointmentId = this.firestoreService.getNewFirestoreId();

    const newDoctorAppointment = this.getDoctorAppointment(animalAppointmentId, newAnimalInfo, doctorDetails);
    const newAnimalAppointment = this.getAnimalAppointmentPayload(doctorAppointmentId, animalAppointmentId, doctorDetails, newAnimalInfo);

    this.doctorAppointmentService.createAppointment(
      newDoctorAppointment,
      doctorDetails.doctor.id,
      doctorAppointmentId
    ).then(() => {
      this.animalAppointmentService.saveAnimalAppointment(newAnimalAppointment, this.user?.id, animalAppointmentId)
        .then(() => {
          this.uiAlertInterceptor.setUiError({
            message: APPOINTMENTFORM_DATA.successAppointment,
            class: 'snackbar-success'
          });
        });
    }).catch((error: any) => {
      this.uiAlertInterceptor.setUiError({message: error.message, class: 'snackbar-error'});
      console.log('Error: ', error);
    });
  }

  getDoctorAppointment(animalAppointmentId: string, newAnimalInfo: any, doctorDetails: any) {
    return new DoctorsAppointmentDTO()
      .setUserName(this.user.name)
      .setUserId(this.user.id)
      .setServices(doctorDetails.service)
      .setDateTime(doctorDetails.date)
      .setAnimal(newAnimalInfo)
      .setLocation(doctorDetails.doctor.location)
      .setUserEmail(this.user.email)
      .setPhone(this.user.phone)
      .setIsAppointmentFinished(false)
      .setIsUserCreated(true)
      .setIsCanceledByUser(false)
      .setIsConfirmedByDoctor(true)
      .setAnimalAppointmentId(animalAppointmentId)
      .setTimestamp(doctorDetails.timestamp);
  }

  getAnimalAppointmentPayload(doctorAppointmentId: string, animalAppointmentId: string, doctorDetails: any, animalInfo: any): any {
    let userPhoneNumber = '+4';
    if (this.user.phone.length === 10) {
      // this change is made for sms notification!! - also validate on cloud functions to make sure that the phone respects this prefix
      userPhoneNumber += this.user.phone;
    }
    return {
      isCanceled: false,
      animalName: animalInfo.name,
      dateTime: doctorDetails.date,
      doctorId: doctorDetails.doctor.id,
      doctorName: doctorDetails.doctor.doctorName,
      location: doctorDetails.doctor.location,
      service: doctorDetails.service,
      doctorAppointmentId: doctorAppointmentId,
      timestamp: doctorDetails.timestamp,
      email: this.user.email,
      phone: userPhoneNumber,
      userId: this.user.id,
      id: animalAppointmentId
    }
  }

  setAnimalToDoAppointment(element: any, animal: any) {
    const currentSelectedElement = document.getElementById(this.selectedAnimal.animalId);
    // @ts-ignore
    currentSelectedElement.classList.remove('link--active');
    element.target.classList.add('link--active');
    this.selectedAnimal = animal
    this.isAnimalSelected = true;
  }

  isTimeValid(doctorDetails: any): boolean {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    if (this.stepHour === null
      || this.stepMinute === null
      || !this.dateTimeUtils.isSelectedDateGreaterOrEqualComparedToCurrentDate(doctorDetails.localeDate)
      || (this.stepHour < currentHours && this.dateTimeUtils.isCurrentDay(doctorDetails.localeDate))) {
      // todo - refactor this - debugg
      // || (this.stepHour <= currentHours && this.stepMinute <= currentMinutes)
      this.uiAlertInterceptor.setUiError({message: APPOINTMENTFORM_DATA.timeValidation, class: 'snackbar-error'});
      return false;
    }
    return true;
  }

  isAppointmentDataInvalid(doctorDetails: any): boolean {
    return !doctorDetails || !doctorDetails.service || !doctorDetails.date || !doctorDetails.doctor;
  }

  //END APPOINTMENT

  //START FORM VALIDATION AND SETTERS
  setCountyAndSetLocalities(county: string): void {
    this.county = county;
    this.locationService.getCitiesByCountyCode(this.countiesAbbr[county])
      .subscribe((response: any) => {
        this.localities = response
      }, error => {
        console.log(error);
      });
  }

  setLocality(locality: string): void {
    this.locality = locality;
  }

  isSearchByLocationDisabled(): boolean {
    return !this.county || !this.locality || !this.selectedAnimal || Object.entries(this.selectedAnimal).length === 0;
  }


  searchDoctorsByCountyAndLocation(): void {
    // if (this.isSearchByLocationDisabled()) {
    //   this.isErrorDisplayed = true;
    //   this.errorMessage = 'Judetul si localitatea trebuie selectate';
    //   return;
    // }

    this.isErrorDisplayed = false;
    this.formErrorMessage = '';
    this.doctorService.getDoctorsByLocation(this.locality).subscribe((doctors) => {
      if (doctors && doctors.length === 0) {
        this.isSearchByUserSuccessAndEmpty = true;
        this.isSearchByUserSuccess = false;
      } else if (doctors.length > 0) {
        this.isSearchByUserSuccessAndEmpty = false;
        this.isSearchByUserSuccess = true;
        this.doctorList = doctors;
      }
    }, error => {
      // todo  alert error
    });
  }

  //END FORM VALIDATION AND SETTERS

}
