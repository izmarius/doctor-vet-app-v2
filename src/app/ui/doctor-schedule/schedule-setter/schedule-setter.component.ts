import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SCHEDULE_COMPONENT} from "../../../shared-data/Constants";
import {IDaySchedule} from "../../../data/model-dto/doctor-DTO";

@Component({
  selector: 'app-schedule-setter',
  templateUrl: './schedule-setter.component.html',
  styleUrls: ['./schedule-setter.component.css']
})
export class ScheduleSetterComponent implements OnInit {
  @Output() checkEmitter = new EventEmitter<IDaySchedule>();
  @Input() day: string;
  @Input() doctorSchedule: any;
  dayOffMsg: string;
  endHour: string;
  endMinute: string;
  errorMessage: string;
  isChecked = false;
  isErrorMessageShown: boolean;
  startHour: string;
  startMinute: string;

  constructor() {
  }

  ngOnInit(): void {
    this.errorMessage = SCHEDULE_COMPONENT.ERROR_MSG;
    this.dayOffMsg = SCHEDULE_COMPONENT.DAY_OFF;
    for (const dayKey in this.doctorSchedule) {
      if (this.day === this.doctorSchedule[dayKey].day) {
        this.isChecked = this.doctorSchedule[dayKey].isChecked;
        const startTime = this.doctorSchedule[dayKey].startTime.split(':');
        const endTime = this.doctorSchedule[dayKey].endTime.split(':');
        this.startHour = startTime[0];
        this.startMinute = startTime[1];
        this.endHour = endTime[0];
        this.endMinute = endTime[1];
        return;
      }
    }
  }

  areDayHoursInvalid(): boolean {
    return !this.startMinute || !this.endMinute || !this.startHour || !this.endHour || this.isHourMinuteIntervalInvalid();
  }

  isHourMinuteIntervalInvalid(): boolean {
    return parseInt(this.startHour, 10) > 23 || parseInt(this.endHour, 10) > 23
      || parseInt(this.startMinute, 10) > 60 || parseInt(this.endMinute, 10) > 60;
  }

  getDoctorSchedulePayload(): IDaySchedule {
    return {
      isChecked: this.isChecked,
      startTime: this.startHour + ':' + this.startMinute,
      endTime: this.endHour + ':' + this.endMinute,
      day: this.day,
    };
  }

  changeDate(): void {
    if (!this.areDayHoursInvalid()) {
      this.checkEmitter.emit(this.getDoctorSchedulePayload());
      this.isErrorMessageShown = false;
    } else {
      this.isErrorMessageShown = true;
    }
  }

  setAndEmitDayInfo(): void {
    if (this.isChecked && this.areDayHoursInvalid()) {
      this.isErrorMessageShown = false;
      return;
    } else if (this.areDayHoursInvalid()) {
      this.isErrorMessageShown = true;
      return;
    }
    this.isErrorMessageShown = false;
    this.isChecked = !this.isChecked;
    this.checkEmitter.emit(this.getDoctorSchedulePayload());
  }
}
