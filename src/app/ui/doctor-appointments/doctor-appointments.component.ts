import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {IDoctorsAppointmentsDTO} from "./dto/doctor-appointments-dto";
import {APPOINTMENT_PAGE, INPUT_LABELS_TXT, USER_CARD_TXT, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {DoctorAppointmentsService} from "./services/doctor-appointments.service";
import {AnimalService} from "./services/animal.service";
import {ICardData} from "../shared/user-card/user-card.component";
import {MatDialog} from "@angular/material/dialog";
import {UserAnimalInfoComponent} from "../user-animal-info/user-animal-info.component";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-doctor-appointments',
  templateUrl: './doctor-appointments.component.html',
  styleUrls: ['./doctor-appointments.component.css']
})
export class DoctorAppointmentsComponent implements OnInit, OnDestroy, AfterViewInit {

  private APPOINTMENT_SUB!: Subscription;
  private appointmentList!: IDoctorsAppointmentsDTO[];
  @ViewChild('cardRow') cardRow: any;
  @ViewChild('animalInfo') animalInfo: any;
  public appointmentMap: any = {};
  public userCardPlaceholder: any;
  private user: any;
  userAnimalData: any;
  cardParentStats: any;
  areAppointmentAvailable = false;
  noAvailableAppointments!: string;

  constructor(private doctorAppointmentService: DoctorAppointmentsService,
              private animalService: AnimalService,
              private dialogRef: MatDialog,
              private router: Router) {
  }

  ngAfterViewInit(): void {
    this.cardParentStats = this.cardRow.nativeElement;
  }

  ngOnInit(): void {
    // this is needed because the af auth subscription sets the localstorage after auth is done;
    // so when we enter this component the localstorage is not set and we need to wait for the af auth answer
    this.noAvailableAppointments = APPOINTMENT_PAGE.noAvailableAppointments
    setTimeout(() => {
      this.user = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
      if(this.user && this.user.name){
        this.router.navigate(['my-animals'])
        return;
      }
      this.userCardPlaceholder = USER_CARD_TXT;
      this.APPOINTMENT_SUB = this.doctorAppointmentService
        .getAllCurrentAppointments(this.user.id)
        .subscribe((appointments) => {
          // todo refresh data if already exists - see if we can improve here
          this.areAppointmentAvailable = false;
          this.appointmentList = [];
          this.appointmentMap = {};
          this.appointmentList = appointments;
          if(appointments.length === 0) {
            this.areAppointmentAvailable = true;
          }
          this.setAppointmentMap();
        });
    }, 300)
  }

  ngOnDestroy(): void {
    this.APPOINTMENT_SUB?.unsubscribe();
  }

  // todo : daca au depasit orele de munca? sau programarea a expirat?
  cancelAppointment(animalId: string | number): void {

    const selectedAppointment = this.appointmentList.find(appointment => appointment.animalData.uid === animalId);
    // delete appointment from doctor - update animal appointment and set with status canceled
    this.openConfirmationModalModal(selectedAppointment);
  }

  mapToCardData(appointment: any): ICardData {
    return {
      title: appointment.userName + ' - ' + appointment.phone,
      values: [{
        placeholder: this.userCardPlaceholder.datePlaceholder,
        value: appointment.dateTime
      }, {
        placeholder: this.userCardPlaceholder.services,
        value: appointment.services
      }, {
        placeholder: this.userCardPlaceholder.animalName,
        value: appointment.animalData.name
      }, {
        placeholder: INPUT_LABELS_TXT.emailLabel,
        value: appointment.userEmail
      }],
      buttonData: {
        buttonId: appointment.animalData.uid,
        placeholder: this.userCardPlaceholder.buttonValue,
        cancelPlaceholder: this.userCardPlaceholder.buttonCancelValue
      }
    };
  }

  openSectionWithAnimalDetails(animalId: string | number): void {
    // we do this because we want to let the card to be generic
    const selectedAppointment = this.appointmentList.find(appointment => appointment.animalData.uid === animalId);
    if (!selectedAppointment || !selectedAppointment.userId) {
      console.log('No user found');
      return;
    }
    const userAnimalObs$ = this.animalService.getAnimalDataAndMedicalHistoryByAnimalId(animalId, selectedAppointment.userId);
    this.userAnimalData = {
      userAnimalDataObs: userAnimalObs$,
      userId: selectedAppointment.userId
    }
    this.openUserAnimalAppointmentModal();
  }

  openUserAnimalAppointmentModal(): void {
    const dialogRef = this.dialogRef.open(UserAnimalInfoComponent, {
      width: '80%',
      panelClass: 'user-animal-details-dialog',
      data: this.userAnimalData
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openConfirmationModalModal(selectedAppointment: any): void {
    const dialogRef = this.dialogRef.open(ConfirmDialogComponent, {
      panelClass: 'confirmation-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.doctorAppointmentService.cancelAppointment(selectedAppointment, this.user)
      }
    });
  }

  setAppointmentMap(): void {
    this.appointmentList.forEach((appointment) => {
      const date = appointment.dateTime.split('-')[0].trim();
      if (this.appointmentMap[date]) {
        this.appointmentMap[date].push(appointment);
      } else {
        this.appointmentMap[date] = [];
        this.appointmentMap[date].push(appointment);
      }
    });
  }
}
