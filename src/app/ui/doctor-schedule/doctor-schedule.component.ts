import {Component, OnInit} from '@angular/core';
import {DoctorDTO, IDaySchedule} from "../../data/model-dto/doctor-DTO";
import {
  APPOINTMENTFORM_DATA,
  DAYS_OF_WEEK,
  DAYS_OF_WEEK_MAP,
  SCHEDULE_HEADER_TEXT,
  USER_LOCALSTORAGE
} from "../../shared-data/Constants";
import {DoctorService} from "../../services/doctor/doctor.service";

@Component({
  selector: 'app-doctor-schedule',
  templateUrl: './doctor-schedule.component.html',
  styleUrls: ['./doctor-schedule.component.css']
})
export class DoctorScheduleComponent implements OnInit {

  storedDoctor!: DoctorDTO;
  headerContent: any;
  daysOfWeekMap: any = DAYS_OF_WEEK_MAP;
  weekDaysList: any[] = [];
  scheduleBtnText: string = '';
  isSaveButtonDisabled = false;
  public minDate = new Date();
  public schedulePlaceholder: any;
  startDate: any;
  endDate: any;
  isOutOfOfficeError = false;

  constructor(private doctorService: DoctorService) {
  }

  ngOnInit(): void {

    this.schedulePlaceholder = SCHEDULE_HEADER_TEXT;
    this.storedDoctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.scheduleBtnText = SCHEDULE_HEADER_TEXT.scheduleButtonText;
    this.weekDaysList = DAYS_OF_WEEK;
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

  saveSchedule(): void {
    // @ts-ignore
    if (!this.storedDoctor.schedule && Object.keys(this.storedDoctor.schedule).length === 0) {
      return;
    }

    this.doctorService.updateDoctorInfo({schedule: this.storedDoctor.schedule}, <string>this.storedDoctor.id)
      .then(() => {
        localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(this.storedDoctor));
        console.log('service updated');
      }, (error) => {
        console.log('Error updating service', error);
      });
  }

  saveOutOfOfficeDate(): void {
    if (!this.startDate && !this.endDate || this.endDate.getTime() < this.startDate.getTime()) {
      // todo display error
      this.isOutOfOfficeError = true;
      return;
    }
    this.isOutOfOfficeError = false;
    const doctorPayload = {
      // @ts-ignore
      outOfOfficeDays: this.storedDoctor.outOfOfficeDays.push({
        startDate: this.startDate,
        endDate: this.endDate
      })
    }

    // @ts-ignore
    this.doctorService.updateDoctorInfo(doctorPayload, this.storedDoctor.id)
      .then(() => {
        this.isOutOfOfficeError = true;
        localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(this.storedDoctor));
        console.log('service updated');
      }, (error) => {
        console.log('Error updating service', error);
      });
  }

}
