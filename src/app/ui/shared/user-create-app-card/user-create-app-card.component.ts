import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateUtilsService} from "../../../data/utils/date-utils.service";
import {DoctorAppointmentsService} from "../../services/doctor-appointments.service";
import {AnimalAppointmentService} from "../../../services/animal-appointment/animal-appointment.service";
import { UiErrorInterceptorService } from '../alert-message/services/ui-error-interceptor.service';
import { APPOINTMENTFORM_DATA } from 'src/app/shared-data/Constants';

@Component({
  selector: 'app-user-create-app-card',
  templateUrl: './user-create-app-card.component.html',
  styleUrls: ['./user-create-app-card.component.scss']
})
export class UserCreateAppCardComponent implements OnInit {
  @Input() doctor: any;
  @Output() createAppointmentEmitter = new EventEmitter();
  services: string[] = [];
  selectedService!: string;
  public minDate = new Date();
  stepMinutes: any;
  public selectedDate: any;
  stepMinute!: number;
  stepHours: any;
  stepHour!: number;
  startDateOk!: boolean;

  constructor(private dateTimeUtils: DateUtilsService, private uiAlertInterceptor: UiErrorInterceptorService) {
  }

  ngOnInit(): void {
    this.setDoctorSchedule();
    this.setDoctorServices();
    this.setDoctorUnavailableDays();
    if (this.doctor.appointmentFrequency) {
      this.stepHours = this.doctor.appointmentFrequency.hourIntervals;
      this.stepHour = this.stepHours[0]
      this.stepMinutes = this.doctor.appointmentFrequency.minuteIntervals;
      this.stepMinute = this.stepMinutes[0]
      this.selectedDate = new Date();
    }
  }

  // filterUnavailableDays(d: Date): boolean {
  //   if (!d) {
  //     return true;
  //   }
  //   const day = d.getDay();
  //   let saturday = null;
  //   let sunday = null;
  //   if (this.doctor.unavailableTime.notWorkingDays && this.doctor.unavailableTime.notWorkingDays.length > 0) {
  //     this.doctor.unavailableTime.notWorkingDays.forEach((dayNumber: number) => {
  //       if (dayNumber === 6) {
  //         saturday = 6
  //       } else if (dayNumber === 0) {
  //         sunday = 0;
  //       }
  //     });
  //     if (saturday && sunday === 0) {
  //       return day !== saturday && day !== sunday;
  //     } else if (saturday) {
  //       return day !== saturday;
  //     } else if (sunday) {
  //       return day !== sunday;
  //     }
  //   }
  //   return true;
  // }

  setDoctorUnavailableDays(): void {
    if (this.doctor.unavailableTime.notWorkingDay && this.doctor.unavailableTime.notWorkingDay.length === 0) {
    }
  }

  setDoctorSchedule(): void {
    for (let key in this.doctor.schedule) {
    }
  }

  setDoctorServices(): void {
    for (let key in this.doctor.services) {
      this.services.push(...this.doctor.services[key]);
    }
  }

  setService(service: string): void {
    this.selectedService = service;
  }

  checkUserAppointmentStartDateValidity(doctor: any, appoinmentNewStartDate: Date, errorMessage: string): boolean {
    if (doctor && (doctor.schedule.sunday.dayNumber === appoinmentNewStartDate.getDay() || doctor.schedule.saturday.dayNumber === appoinmentNewStartDate.getDay()) && !doctor.schedule.saturday.isChecked) {
      this.uiAlertInterceptor.setUiError({
        message: errorMessage,
        class: 'snackbar-error'
      });
      return true;
    }
    return false;
  }

  onStartDateChange(startDateChannge: Date): void {
    this.startDateOk = this.checkUserAppointmentStartDateValidity(this.doctor, startDateChannge, APPOINTMENTFORM_DATA.wrongStartDate);
  }

  createAppointmentByUser(doctor: any): void {
    const doctorAppointmentPayload = {
      localeDate: this.selectedDate.toLocaleDateString(),
      doctor: doctor,
      date: this.selectedDate.toLocaleDateString() + " - " + this.dateTimeUtils.formatTime(this.stepHour, this.stepMinute),
      timestamp: this.selectedDate.getTime(),
      service: this.selectedService
    }
    this.createAppointmentEmitter.emit(doctorAppointmentPayload);
  }

  isStartDateOk(): any {
    return this.startDateOk;
  }
}
