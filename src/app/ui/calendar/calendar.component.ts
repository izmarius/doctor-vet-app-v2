import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {isSameDay, isSameMonth} from 'date-fns';
import {CALENDAR_DATA, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {DoctorAppointmentsService} from "../doctor-appointments/services/doctor-appointments.service";
import {AnimalService} from "../doctor-appointments/services/animal.service";
import {UserAnimalInfoComponent} from "../user-animal-info/user-animal-info.component";
import {MatDialog} from "@angular/material/dialog";
import {DoctorAppointmentModalComponent} from "../doctor-appointment-modal/doctor-appointment-modal.component";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, AfterViewInit {

  constructor(private doctorService: DoctorAppointmentsService,
              private animalService: AnimalService,
              private dialogRef: MatDialog) {
  }

  ngOnInit(): void {
    this.calendarPlaceHolder = CALENDAR_DATA;
    // todo move to a service
    this.doctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.doctorService.getDoctorAppointments(this.doctor.id).subscribe((res) => {
      this.events = res;
    })
  }

  ngAfterViewInit() {

  }

  doctor: any;
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  activeDayIsOpen = true;
  events: any[] = [];
  calendarPlaceHolder: any;
  userAnimalData: any;

  setView(view: CalendarView): void {
    this.view = view;
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
      userId: event.userId
    }
    this.openUserAnimalAppointmentModal();
  }

  addAppointment(date: any) {
    // transform from gmt to eest and inject date into dialog
    this.openAppointmentsModal();
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

  openAppointmentsModal(): void {
    const dialogRef = this.dialogRef.open(DoctorAppointmentModalComponent, {
      height: '40rem',
      panelClass: 'doctor-appointment-dialog',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

}
