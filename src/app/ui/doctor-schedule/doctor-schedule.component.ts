import {Component, OnInit} from '@angular/core';
import {DoctorDTO, IDaySchedule} from "../../data/model-dto/doctor-DTO";
import {
  DAYS_OF_WEEK,
  DAYS_OF_WEEK_MAP, FREQUENCY_MINUTES_INTERVALS,
  SCHEDULE_HEADER_TEXT, UI_ALERTS_CLASSES,
  USER_LOCALSTORAGE
} from "../../shared-data/Constants";
import {DoctorService} from "../../services/doctor/doctor.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";

@Component({
  selector: 'app-doctor-schedule',
  templateUrl: './doctor-schedule.component.html',
  styleUrls: ['./doctor-schedule.component.scss']
})
export class DoctorScheduleComponent implements OnInit {
  selectedInterval!: number;
  storedDoctor!: DoctorDTO;
  weekDaysList: any[] = [];
  scheduleBtnText: string = '';
  daysOfWeekMap: any;
  public minDate = new Date();
  public schedulePlaceholder: any;
  startDate: any;
  endDate: any;

  constructor(private doctorService: DoctorService,
              private uiAlertInterceptor: UiErrorInterceptorService) {
  }

  ngOnInit(): void {
    this.schedulePlaceholder = SCHEDULE_HEADER_TEXT;
    this.storedDoctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.scheduleBtnText = SCHEDULE_HEADER_TEXT.scheduleButtonText;
    this.weekDaysList = DAYS_OF_WEEK;
    this.selectedInterval = <number>this.storedDoctor.appointmentInterval;
    this.daysOfWeekMap = DAYS_OF_WEEK_MAP;

  }

  getAndSetDay(dayPayload: IDaySchedule): void {
    for (const engDay in this.daysOfWeekMap as any) {
      if (this.daysOfWeekMap[engDay] === dayPayload.day) {
        // @ts-ignore
        this.storedDoctor.schedule[engDay] = dayPayload;
        return;
      }
    }
  }

  isSaveScheduleDisabled(): boolean {
    return !this.storedDoctor.schedule || Object.keys(this.storedDoctor.schedule).length === 0;
  }

  saveSchedule(): void {
    // @ts-ignore
    if (this.isSaveScheduleDisabled()) {
      return;
    }

    this.setDoctorUnavailableTime();
    this.setDoctorWorkingHoursInterval();

    this.storedDoctor.appointmentInterval = this.selectedInterval;

    // @ts-ignore
    this.storedDoctor.appointmentFrequency.minuteIntervals = FREQUENCY_MINUTES_INTERVALS[this.selectedInterval.toString()];
    this.doctorService.updateDoctorInfo({
      schedule: this.storedDoctor.schedule,
      unavailableTime: this.storedDoctor.unavailableTime,
      appointmentFrequency: this.storedDoctor.appointmentFrequency,
      appointmentInterval: this.selectedInterval
    }, <string>this.storedDoctor.id)
      .then(() => {
        localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(this.storedDoctor));
        this.uiAlertInterceptor.setUiError({
          message: SCHEDULE_HEADER_TEXT.saveScheduleSuccess,
          class: UI_ALERTS_CLASSES.SUCCESS
        });
      }, (error) => {
        this.uiAlertInterceptor.setUiError({
          message: SCHEDULE_HEADER_TEXT.saveScheduleError,
          class: UI_ALERTS_CLASSES.ERROR
        });
        console.log('Error updating service', error);
      });
  }

  setDoctorWorkingHoursInterval(): void {
    this.storedDoctor.appointmentFrequency.hourIntervals = [];
    const startHour = parseInt(this.storedDoctor.schedule['monday-friday'].startTime.split(':')[0], 10);
    const endHour = parseInt(this.storedDoctor.schedule['monday-friday'].endTime.split(':')[0], 10);
    for (let i = startHour; i <= endHour; i++) {
      this.storedDoctor.appointmentFrequency.hourIntervals.push(i);
    }
  }

  setDoctorUnavailableTime(): void {
    this.storedDoctor.unavailableTime.notWorkingDays = [];
    for (let key in this.storedDoctor.schedule) {
      if (!this.storedDoctor.schedule[key].isChecked) {
        this.storedDoctor.unavailableTime.notWorkingDays.push(this.storedDoctor.schedule[key].dayNumber);
      }
    }
  }

  setAppointmentInterval(interval: number): void {
    this.selectedInterval = interval
  }

//   SET BLOCKED TIME FOR DOCTOR
//  START OUT OF OFFICE
}
