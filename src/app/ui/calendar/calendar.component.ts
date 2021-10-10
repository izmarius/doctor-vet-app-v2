import {Component, OnDestroy, OnInit} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {isSameDay, isSameMonth} from 'date-fns';
import {CALENDAR_DATA, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {DoctorAppointmentsService} from "../doctor-appointments/services/doctor-appointments.service";
import {AnimalService} from "../doctor-appointments/services/animal.service";
import {UserAnimalInfoComponent} from "../user-animal-info/user-animal-info.component";
import {MatDialog} from "@angular/material/dialog";
import {DoctorAppointmentModalComponent} from "../doctor-appointment-modal/doctor-appointment-modal.component";
import {Subscription} from "rxjs";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {
  doctor: any;
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  activeDayIsOpen = true;
  appointments: any[] = [];
  calendarPlaceHolder: any;
  userAnimalData: any;
  hourToStartTheDay: number = 0;
  hourToEndTheDay: number = 23;
  doctorAppointmentsSub!: Subscription;

  constructor(private doctorService: DoctorAppointmentsService,
              private animalService: AnimalService,
              private dialogRef: MatDialog,
              private alertInterceptor: UiErrorInterceptorService) {
  }

  ngOnInit() {
    this.calendarPlaceHolder = CALENDAR_DATA;
    this.doctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.setHourDayStartAndDayEnd();
    this.doctorAppointmentsSub = this.doctorService.getDoctorAppointments(this.doctor.id).subscribe((res) => {
      this.appointments = res;
    });
  }

  ngOnDestroy() {
    this.doctorAppointmentsSub?.unsubscribe();
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  setHourDayStartAndDayEnd() {
    const day = new Date().getDay();
    if (day > 0 || day < 6) {
      this.hourToStartTheDay = parseInt(this.doctor.schedule["monday-friday"].startTime.slice(0, 2));
      this.hourToEndTheDay = parseInt(this.doctor.schedule["monday-friday"].endTime.slice(0, 2));
    } else if (day === 0 && !this.doctor.schedule.sunday) {
      return;
    } else if (day === 6 && !this.doctor.schedule.saturday) {
      return;
    } else if (day === 0 && this.doctor.schedule.sunday) {
      this.hourToStartTheDay = parseInt(this.doctor.schedule.sunday.startTime[1]);
      this.hourToEndTheDay = parseInt(this.doctor.schedule.sunday.endTime[1]);
    } else if (day === 6 && this.doctor.schedule.saturday) {
      this.hourToStartTheDay = parseInt(this.doctor.schedule.saturday.startTime[1]);
      this.hourToEndTheDay = parseInt(this.doctor.schedule.saturday.endTime[1]);
    }
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  handleEvent(action: string, event: CalendarEvent | any) {
    const userAnimalObs$ = this.animalService.getAnimalDataAndMedicalHistoryByAnimalId(event.animalId, event.userId);
    this.userAnimalData = {
      userAnimalDataObs: userAnimalObs$,
      userId: event.userId,
      appointment: event.appointment,
      appointmentId: event.appointmentId
    }
    this.openUserAnimalAppointmentModal();
  }

  addAppointment(date: any) {
    const estDate = new Date(date);
    const now = new Date();

    if (estDate.getTime() < now.getTime()) {
      // alert that the date shouldn't be in the past
      this.alertInterceptor.setUiError({
        message: 'Programarea nu poate fi setata in trecut',
        class: 'snackbar-error'
      });
      return;
    }
    // transform from gmt to eest and inject date into dialog
    this.openAppointmentsModal(estDate);
  }

  openUserAnimalAppointmentModal(): void {
    const dialogRef = this.dialogRef.open(UserAnimalInfoComponent, {
      width: '80%',
      panelClass: 'user-animal-details-dialog',
      data: this.userAnimalData
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }

  openAppointmentsModal(date: Date): void {
    const dialogRef = this.dialogRef.open(DoctorAppointmentModalComponent, {
      height: '40rem',
      panelClass: 'doctor-appointment-dialog',
      data: date
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

}
