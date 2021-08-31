import {Component, OnInit} from '@angular/core';
import {DoctorDTO, IDaySchedule} from "../../data/model-dto/doctor-DTO";
import {
  DAYS_OF_WEEK,
  DAYS_OF_WEEK_MAP, FREQUENCY_MINUTES_INTERVALS,
  SCHEDULE_HEADER_TEXT,
  USER_LOCALSTORAGE
} from "../../shared-data/Constants";
import {DoctorService} from "../../services/doctor/doctor.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";

@Component({
  selector: 'app-doctor-schedule',
  templateUrl: './doctor-schedule.component.html',
  styleUrls: ['./doctor-schedule.component.css']
})
export class DoctorScheduleComponent implements OnInit {
  minuteIntervals = [10, 15, 20, 25, 30, 35, 40, 45];
  selectedInterval!: number;
  storedDoctor!: DoctorDTO;
  headerContent: any;
  daysOfWeekMap: any = DAYS_OF_WEEK_MAP;
  weekDaysList: any[] = [];
  scheduleBtnText: string = '';
  public minDate = new Date();
  public schedulePlaceholder: any;
  startDate: any;
  blockedDate: any;
  endDate: any;
  isOutOfOfficeError = false;
  isSaveBlockedDayBtnDisabled = false;
  blockedStartHour!: number;
  blockedEndHour!: number;

  constructor(private doctorService: DoctorService,
              private uiAlertInterceptor: UiErrorInterceptorService) {
  }

  ngOnInit(): void {
    this.schedulePlaceholder = SCHEDULE_HEADER_TEXT;
    this.storedDoctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.scheduleBtnText = SCHEDULE_HEADER_TEXT.scheduleButtonText;
    this.weekDaysList = DAYS_OF_WEEK;
    debugger
    this.selectedInterval = <number>this.storedDoctor.appointmentInterval;
    this.headerContent = {
      title: SCHEDULE_HEADER_TEXT.title,
      subtitle: SCHEDULE_HEADER_TEXT.subtitle,
      style: this.getHeaderStyle()
    };
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

  getHeaderStyle(): any {
    return {
      headerContainer: {
        height: '300px',
        background: '#ffdc4d',
      },
      headerContent: {
        height: '180px'
      }
    };
  }

  setBlockedHours() {
    if ((this.blockedStartHour && this.blockedStartHour > 24) || (this.blockedEndHour && this.blockedEndHour > 24)) {
      this.blockedStartHour = 24;
      this.blockedEndHour = 24;
    }
  }

  isBlockedHoursDisabled(): boolean {
    return !this.blockedDate || !this.blockedEndHour || !this.blockedStartHour || this.blockedStartHour > this.blockedEndHour;
  }

  saveBlockedDay(): void {
    if (this.isBlockedHoursDisabled()) {
      this.uiAlertInterceptor.setUiError({message: 'Toate campurile trebuie sa fie valide', class: 'snackbar-error'});
      return;
    }
    const localDate = this.blockedDate.toLocaleString().split(',')[0];
    if (!this.storedDoctor.unavailableTime) {
      this.storedDoctor.unavailableTime = {};
      this.storedDoctor.unavailableTime[localDate] = {
        startHour: this.blockedStartHour,
        endHour: this.blockedEndHour
      };
    } else if (!this.storedDoctor.unavailableTime[localDate]) {
      this.storedDoctor.unavailableTime[localDate] = {
        startHour: this.blockedStartHour,
        endHour: this.blockedEndHour
      };
    } else {
      this.storedDoctor.unavailableTime[localDate].startHour = this.blockedStartHour;
      this.storedDoctor.unavailableTime[localDate].endHour = this.blockedEndHour;
    }

    this.doctorService.updateDoctorInfo({unavailableTime: this.storedDoctor.unavailableTime}, <string>this.storedDoctor.id).then(() => {
      localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(this.storedDoctor));
      this.uiAlertInterceptor.setUiError({
        message: SCHEDULE_HEADER_TEXT.saveScheduleSuccess,
        class: 'snackbar-success'
      });
    }, (error) => {
      this.uiAlertInterceptor.setUiError({message: SCHEDULE_HEADER_TEXT.saveScheduleError, class: 'snackbar-error'});
      console.log('Error updating service', error);
    });
  }

  isSaveScheduleDisabled(): boolean {
    // todo - cover also if the schedule is not changed
    return !this.storedDoctor.schedule || Object.keys(this.storedDoctor.schedule).length === 0 || !this.selectedInterval;
  }

  saveSchedule(): void {
    // @ts-ignore
    if (this.isSaveScheduleDisabled()) {
      return;
    }
    this.storedDoctor.unavailableTime.notWorkingDays = [];

    for (let key in this.storedDoctor.schedule) {
      if (!this.storedDoctor.schedule[key].isChecked) {
        this.storedDoctor.unavailableTime.notWorkingDays.push(this.storedDoctor.schedule[key].dayNumber);
      }
    }

    const startHour = parseInt(this.storedDoctor.schedule['monday-friday'].startTime.split(':')[0], 10);
    const endHour = parseInt(this.storedDoctor.schedule['monday-friday'].endTime.split(':')[0], 10);
    this.storedDoctor.appointmentFrequency.hourIntervals = [];
    this.storedDoctor.appointmentInterval = this.selectedInterval;

    for (let i = startHour; i <= endHour; i++) {
      this.storedDoctor.appointmentFrequency.hourIntervals.push(i);
    }
    // @ts-ignore
    this.storedDoctor.appointmentFrequency.minuteIntervals = FREQUENCY_MINUTES_INTERVALS[this.selectedInterval.toString()];
    debugger;
    // this.storedDoctor.appointmentFrequency.hourIntervals = FREQUENCY_INTERVALS[this.selectedInterval.toString()];
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
          class: 'snackbar-success'
        });
      }, (error) => {
        this.uiAlertInterceptor.setUiError({message: SCHEDULE_HEADER_TEXT.saveScheduleError, class: 'snackbar-error'});
        console.log('Error updating service', error);
      });
  }

  cancelOutOfOffice(index: number): void {
    // @ts-ignore
    this.storedDoctor.outOfOfficeDays.splice(index, 1);
    // @ts-ignore
    this.doctorService.updateDoctorInfo({outOfOfficeDays: this.storedDoctor.outOfOfficeDays}, this.storedDoctor.id)
      .then(() => {
        this.storedDoctor.outOfOfficeDays?.splice(index, 1);
        localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(this.storedDoctor));
        this.uiAlertInterceptor.setUiError({
          message: SCHEDULE_HEADER_TEXT.cancelOutOfOfficeSuccess,
          class: 'snackbar-success'
        });
      }, (error) => {
        this.uiAlertInterceptor.setUiError({
          message: SCHEDULE_HEADER_TEXT.cancelOutOfOfficeError,
          class: 'snackbar-error'
        });
        console.log('Error updating service', error);
      });
  }

  setAppointmentInterval(interval: number): void {
    this.selectedInterval = interval
  }

  isOutOfOfficeDisabled(): boolean {
    return !this.startDate || !this.endDate || this.endDate.getTime() < this.startDate.getTime();
  }

  // todo ADD MATDATEPICKER RANGE!!!!!
  saveOutOfOfficeDate(): void {
    if (this.isOutOfOfficeDisabled()) {
      // todo display error
      this.isOutOfOfficeError = true;
      return;
    }
    // @ts-ignore
    this.storedDoctor.outOfOfficeDays.push({
      startTimestamp: this.startDate.getTime(),
      endTimestamp: this.endDate.getTime(),
      startDate: this.startDate.toLocaleDateString(),
      endDate: this.endDate.toLocaleDateString()
    });

    if (!this.storedDoctor.unavailableTime.outOfOfficeTimestamp) {
      this.storedDoctor.unavailableTime.outOfOfficeTimestamp = [];
    }

    // todo see if timestamps overlaps!
    // this.storedDoctor.unavailableTime.outOfOfficeTimestamp.push({
    //   startTimestamp: this.startDate.getTime(),
    //   endTimestamp: this.endDate.getTime()
    // });

    // @ts-ignore
    this.doctorService.updateDoctorInfo({
      outOfOfficeDays: this.storedDoctor.outOfOfficeDays,
    }, <string>this.storedDoctor.id)
      .then(() => {
        this.isOutOfOfficeError = false;
        // todo - alert message?
        this.uiAlertInterceptor.setUiError({
          message: SCHEDULE_HEADER_TEXT.addOutOfOfficeSuccess,
          class: 'snackbar-success'
        });
        localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(this.storedDoctor));
      }, (error) => {
        this.uiAlertInterceptor.setUiError({
          message: SCHEDULE_HEADER_TEXT.addOutOfOfficeError,
          class: 'snackbar-error'
        });
        console.log('Error ', error);
      });
  }

}
