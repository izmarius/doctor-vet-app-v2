import {Component, OnInit} from '@angular/core';
import {
  APPOINTMENTFORM_DATA,
  COUNTIES,
  COUNTIES_ABBR,
  UI_ALERTS_CLASSES,
  USER_LOCALSTORAGE
} from "../../shared-data/Constants";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {DoctorService} from "../../services/doctor/doctor.service";
import {LocationService} from "../../services/location-service/location.service";
import {AnimalUtilInfo} from "../dto/animal-util-info";
import {FirestoreService} from "../../data/http/firestore.service";
import {DoctorAppointmentsService} from "../services/doctor-appointments.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {AppointmentsService} from "../../services/appointments/appointments.service";
import {take} from "rxjs/operators";
import {BatchService} from "../../services/batch/batch.service";

@Component({
  selector: 'app-user-appointment',
  templateUrl: './user-appointment.component.html',
  styleUrls: ['./user-appointment.component.scss']
})
export class UserAppointmentDialogComponent implements OnInit {
  userAppointmentFormText: any;
  countiesAbbr: any;
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
  isUserWithoutAnimal = false;

  constructor(private appointmentService: AppointmentsService,
              private batchService: BatchService,
              private dateTimeUtils: DateUtilsService,
              private doctorAppointmentService: DoctorAppointmentsService,
              private doctorService: DoctorService,
              private firestoreService: FirestoreService,
              private locationService: LocationService,
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
        class: UI_ALERTS_CLASSES.ERROR
      });
      return;
    }

    const appointmentId = this.firestoreService.getNewFirestoreId();
    if (this.doctorAppointmentService.areAppointmentsOverlapping(new Date(doctorDetails.timestamp), doctorDetails.doctor, appointmentId)) {
      return;
    }

    const newAnimalInfo = new AnimalUtilInfo()
      .setName(this.selectedAnimal.animalName)
      .setUid(this.selectedAnimal.animalId);

    const newAppointment = this.appointmentService.getUserAppointmentDTO(newAnimalInfo, doctorDetails, this.user, appointmentId);

    // todo update doctor - also on cancel appointment by user
    const doctorBatchDocument = this.batchService.getMapper('doctors', doctorDetails.doctor.id, {appointmentsMap: doctorDetails.doctor.appointmentsMap}, 'update');
    const appointmentBatchDoc = this.batchService.getMapper('appointments', newAppointment.id, newAppointment, 'set');
    this.batchService.createBatch([appointmentBatchDoc, doctorBatchDocument])
      .then(() => {
        this.uiAlertInterceptor.setUiError({
          message: APPOINTMENTFORM_DATA.successAppointment,
          class: UI_ALERTS_CLASSES.SUCCESS
        });
      }).catch((error: any) => {
      this.uiAlertInterceptor.setUiError({message: error.message, class: UI_ALERTS_CLASSES.ERROR});
      console.error('Error: ', error);
    });
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
    if (doctorDetails.stepHour === null
      || doctorDetails.stepMinute === null
      || !this.dateTimeUtils.isSelectedDateGreaterOrEqualComparedToCurrentDate(doctorDetails.localeDate)
      || (doctorDetails.stepHour < currentHours && this.dateTimeUtils.isCurrentDay(doctorDetails.localeDate))) {
      // todo - refactor this - debugg
      // || (this.stepHour <= currentHours && this.stepMinute <= currentMinutes)
      this.uiAlertInterceptor.setUiError({
        message: APPOINTMENTFORM_DATA.timeValidation,
        class: UI_ALERTS_CLASSES.ERROR
      });
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
      .pipe(take(1))
      .subscribe((response: any) => {
        this.localities = response
      }, error => {
        console.error(error);
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
    this.doctorService.getDoctorsByLocation(this.locality)
      .pipe(take(1))
      .subscribe((doctors) => {
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
