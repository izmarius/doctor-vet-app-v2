import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {
  CalendarDayViewBeforeRenderEvent,
  CalendarEvent,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent
} from 'angular-calendar';
import {isSameDay, isSameMonth} from 'date-fns';
import {APPOINTMENT_MESSAGES, CALENDAR_DATA, UI_ALERTS_CLASSES, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {DoctorAppointmentsService} from "../services/doctor-appointments.service";
import {AnimalService} from "../services/animal.service";
import {UserAnimalInfoComponent} from "../user-animal-info/user-animal-info.component";
import {MatDialog} from "@angular/material/dialog";
import {DoctorAppointmentModalComponent} from "../doctor-appointment-modal/doctor-appointment-modal.component";
import {Subscription} from "rxjs";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {UserWithoutAccountDetailsCardComponent} from "../user-without-account-details-card/user-without-account-details-card.component";
import {UserService} from "../user-profile/services/user.service";
import {take} from "rxjs/operators";

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
  doctorAppointmentsSub$!: Subscription;
  weekStartsOn: number = 1;


  constructor(private doctorService: DoctorAppointmentsService,
              private animalService: AnimalService,
              private dialogRef: MatDialog,
              private alertInterceptor: UiErrorInterceptorService,
              private doctorAppointmentService: DoctorAppointmentsService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.calendarPlaceHolder = CALENDAR_DATA;
    this.doctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.onResize();
    this.setHourDayStartAndDayEnd();
    this.getDoctorAppointments();
  }

  ngOnDestroy() {
    this.doctorAppointmentsSub$?.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth && window.innerWidth <= 641) {
      this.view = CalendarView.Day;
    } else {
      this.view = CalendarView.Week;
    }
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    // todo set not working days disabled? without click event?
    // renderEvent.hourColumns.forEach((hourColumn) => {
    //   hourColumn.hours.forEach((hour) => {
    //     hour.segments.forEach((segment) => {
    //         segment.cssClass = 'bg-pink';
    //     });
    //   });
    // });
  }

  beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent) {
    // renderEvent.hourColumns.forEach((hourColumn) => {
    //   hourColumn.hours.forEach((hour) => {
    //     hour.segments.forEach((segment) => {
    //       if (segment.date.getHours() >= 2 && segment.date.getHours() <= 5) {
    //         segment.cssClass = 'bg-pink';
    //       }
    //     });
    //   });
    // });
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  getDoctorAppointments() {
    this.doctorAppointmentsSub$ = this.doctorService.getDoctorAppointments(this.doctor.id)
      .subscribe((res) => {
        this.resetDoctorAppointmentsMap();
        this.appointments = res.map((calendarApp: any) => {
          return this.setAndGetCalendarAppointmentsBasedOnDoctorAndUser(calendarApp);
        });
      });
  }

  resetDoctorAppointmentsMap() {
    this.userService.getUserByEmail(this.doctor.email)
      .pipe(take(1))
      .subscribe((doctor: any) => {
        this.doctor = doctor;
        localStorage.removeItem(USER_LOCALSTORAGE);
        localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(this.doctor));
      });
  }

  setAndGetCalendarAppointmentsBasedOnDoctorAndUser(calendarApp: any): any {
    if (calendarApp.appointment.isCanceledByUser) {
      calendarApp.color = {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      }
      return calendarApp;
    } else if (calendarApp.appointment.isUserCreated) {
      calendarApp.color = {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
      }
    }
    return calendarApp;
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
    if (this.hourToEndTheDay) {
      this.hourToEndTheDay--;
    }
  }

  dayClicked({date, events}: { date: Date; events: CalendarEvent[] }): void {
    if (events && events.length === 0) {
      this.openAppointmentsModal(date);
    } else if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  calendarIntervalClicked(event: CalendarEvent | any) {
    if (!event.userId) {
      const appointmentPayload = {
        appointment: event.appointment,
        appointmentId: event.appointmentId
      }
      this.openUserWithoutAccountAnimalAppointmentModal(appointmentPayload);
    } else {
      this.userAnimalData = {
        userAnimalDataObs: this.animalService.getAnimalDataAndMedicalHistoryByAnimalId(event.animalId, event.userId),
        userId: event.userId,
        appointment: event.appointment,
        appointmentId: event.appointmentId
      }
      this.openUserAnimalAppointmentModal();
    }
  }

  addAppointment(date: any) {
    if (this.doctorAppointmentService.isFreeDayForDoctor(this.doctor.schedule, date) ||
      this.doctorAppointmentService.checkWorkingDaysIfHourIsSetOutOfSchedule(this.doctor.schedule, date)) {
      return;
    }
    const estDate = new Date(date);
    const now = new Date();

    if (estDate.getTime() < now.getTime()) {
      this.alertInterceptor.setUiError({
        message: APPOINTMENT_MESSAGES.APPOINTMENT_IN_PAST_NOT_POSSIBLE,
        class: UI_ALERTS_CLASSES.ERROR
      });
      return;
    }
    // transform from gmt to eest and inject date into dialog
    this.openAppointmentsModal(estDate);
  }

  openUserAnimalAppointmentModal(): void {
    this.dialogRef.open(UserAnimalInfoComponent, {
      width: '80%',
      panelClass: 'user-animal-details-dialog',
      data: this.userAnimalData
    });
  }

  openUserWithoutAccountAnimalAppointmentModal(appointmentPayload: any): void {
    const dialogRef = this.dialogRef.open(UserWithoutAccountDetailsCardComponent, {
      width: '20%',
      panelClass: 'user-without-account-details-dialog',
      data: appointmentPayload
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doctorService.deleteAppointment(appointmentPayload.appointmentId, this.doctor.id);
      }
    });
  }

  openAppointmentsModal(date: Date): void {
    this.dialogRef.open(DoctorAppointmentModalComponent, {
      height: '40rem',
      panelClass: 'doctor-appointment-dialog',
      data: date
    });
  }
}
