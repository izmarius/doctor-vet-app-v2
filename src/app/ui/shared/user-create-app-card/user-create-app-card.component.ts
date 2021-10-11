import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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
  public selectedDate: any;
  stepMinutes: any;
  stepMinute!: number;
  stepHours: any;
  stepHour!: number;

  constructor() {
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
    }
  }

  filterUnavailableDays(d: Date): boolean {
    if (!d) {
      return true;
    }
    const day = d.getDay();
    let saturday = null;
    let sunday = null;
    if (this.doctor.unavailableTime.notWorkingDays && this.doctor.unavailableTime.notWorkingDays.length > 0) {
      this.doctor.unavailableTime.notWorkingDays.forEach((dayNumber: number) => {
        if (dayNumber === 6) {
          saturday = 6
        } else if (dayNumber === 0) {
          sunday = 0;
        }
      });
      if (saturday && sunday === 0) {
        return day !== saturday && day !== sunday;
      } else if (saturday) {
        return day !== saturday;
      } else if (sunday) {
        return day !== sunday;
      }
    }
    return true;
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

  createAppointmentByUser(doctor: any): void {
    const doctorAppointmentPayload = {
      doctor: doctor,
      date: this.selectedDate.toLocaleString() + " - " + this.stepHour + ":" + this.stepMinute,
      time: this.stepHour + ":" + this.stepMinute
    }
    this.createAppointmentEmitter.emit(doctorAppointmentPayload);
  }
}
