import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateUtilsService} from "../../../data/utils/date-utils.service";
import { UiErrorInterceptorService } from '../alert-message/services/ui-error-interceptor.service';
import {DoctorAppointmentsService} from "../../services/doctor-appointments.service";

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

  constructor(private dateTimeUtils: DateUtilsService,
              private uiAlertInterceptor: UiErrorInterceptorService,
              private doctorAppointmentService: DoctorAppointmentsService) {
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

  onStartDateChange(startDateChange: Date): void {
    this.startDateOk = this.doctorAppointmentService.isFreeDayForDoctor(this.doctor.schedule, startDateChange);
  }

  createAppointmentByUser(doctor: any): void {
    this.selectedDate.setHours(this.stepHour, this.stepMinute);
    const doctorAppointmentPayload = {
      localeDate: this.selectedDate.toLocaleDateString(),
      doctor: doctor,
      date: this.selectedDate.toLocaleDateString() + " - " + this.dateTimeUtils.formatTime(this.stepHour, this.stepMinute),
      timestamp: this.selectedDate.getTime(),
      service: this.selectedService,
      stepHour: this.stepHour,
      stepMinute: this.stepMinute
    }
    this.createAppointmentEmitter.emit(doctorAppointmentPayload);
  }

  isStartDateOk(): any {
    return this.startDateOk;
  }
}
