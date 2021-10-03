import {Component, OnInit} from '@angular/core';
import {APPOINTMENTFORM_DATA, COUNTIES, COUNTIES_ABBR} from "../../shared-data/Constants";
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

  constructor(private dateTimeUtils: DateUtilsService,
              private doctorService: DoctorService,
              private locationService: LocationService) {
  }

  ngOnInit(): void {
    this.counties = COUNTIES;
    this.countiesAbbr = COUNTIES_ABBR;
    this.userAppointmentFormText = APPOINTMENTFORM_DATA;
  }

  setLocality(locality: string): void {
    this.locality = locality;
  }

  createAppointment(doctorDetails: any): void {
    console.log(doctorDetails);
  }

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
    this.county = 'Cluj';
    this.locality = 'Cluj-Napoca';
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
