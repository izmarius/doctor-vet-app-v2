import {Component, OnInit} from '@angular/core';
import {APPOINTMENTFORM_DATA, COUNTIES, COUNTIES_ABBR, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {DoctorService} from "../../services/doctor/doctor.service";
import {LocationService} from "../../services/location-service/location.service";

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

  constructor(private dateTimeUtils: DateUtilsService,
              private doctorService: DoctorService,
              private locationService: LocationService) {
  }

  ngOnInit(): void {
    this.counties = COUNTIES;
    this.countiesAbbr = COUNTIES_ABBR;
    this.userAppointmentFormText = APPOINTMENTFORM_DATA;
    this.user = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    // move to a set method or refactor?
    this.selectedAnimal = this.user.animals && this.user.animals.length > 0 ? this.user.animals[0] : {};
  }

  setLocality(locality: string): void {
    this.locality = locality;
  }

  createAppointment(doctorDetails: any): void {
    debugger;
    // todo validate before sending data

  }

  setAnimalToDoAppointment(animal: any) {
    this.selectedAnimal = animal
    this.isAnimalSelected = true;
  }

  validateTime(): void {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    // todo check when doctor has last appointment - set in dropdown only available hours?
    // todo - add start hour/ end hour? - if doctor wants to block 2 hours for an appointment what he'll do?
    if (this.stepHour === null
      || this.stepMinute === null) {
      // || !this.dateTimeUtils.isSelectedDateGreaterOrEqualComparedToCurrentDate(this.appointmentForm.value.startDate.toLocaleDateString())
      // || (this.stepHour < currentHours && this.dateTimeUtils.isCurrentDay(this.appointmentForm.value.startDate.toLocaleDateString()))) {
      // todo - refactor this - debugg
      // || (this.stepHour <= currentHours && this.stepMinute <= currentMinutes)
      // this.setErrorMessage(APPOINTMENTFORM_DATA.timeValidation);
      return;
    }
    // this.setErrorMessage('');
    // this.appointmentForm.controls.startTime.setValue(this.dateTimeUtils.formatTime(this.stepHour, this.stepMinute));
  }

  //END APPOINTMENT
  setCountyAndSetLocalities(county: string): void {
    this.county = county;
    this.locationService.getCitiesByCountyCode(this.countiesAbbr[county])
      .subscribe((response: any) => {
        this.localities = response
      }, error => {
        console.log(error);
      });
  }

  isSearchByLocationDisabled(): boolean {
    return !this.county || !this.locality;
  }

  searchDoctorsByCountyAndLocation(): void {
    // if (this.isSearchByLocationDisabled()) {
    //   this.isErrorDisplayed = true;
    //   this.errorMessage = 'Judetul si localitatea trebuie selectate';
    //   return;
    // }

    this.isErrorDisplayed = false;
    this.errorMessage = '';
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

}
