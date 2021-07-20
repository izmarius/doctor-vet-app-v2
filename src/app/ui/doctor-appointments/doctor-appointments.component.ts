import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {IDoctorsAppointmentsDTO} from "./dto/doctor-appointments-dto";
import {INPUT_LABELS_TXT, USER_CARD_TXT, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {DoctorAppointmentsService} from "./services/doctor-appointments.service";
import {AnimalService} from "./services/animal.service";
import {ICardData} from "../shared/user-card/user-card.component";

@Component({
  selector: 'app-doctor-appointments',
  templateUrl: './doctor-appointments.component.html',
  styleUrls: ['./doctor-appointments.component.css']
})
export class DoctorAppointmentsComponent implements OnInit, OnDestroy {

  private APPOINTMENT_SUB!: Subscription;
  private appointmentList!: IDoctorsAppointmentsDTO[];
  @ViewChild('cardComponent') private cardComponent: undefined;
  public appointmentMap: any = {};
  public isUserCardClicked = false;
  public userCardPlaceholder: any;
  private user: any;
  userAnimalData: any;

  constructor(private doctorAppointmentService: DoctorAppointmentsService,
              private animalService: AnimalService) {
  }

  ngOnInit(): void {
    // this is needed because the af auth subscription sets the localstorage after auth is done;
    // so when we enter this component the localstorage is not set and we need to wait for the af auth answer
    setTimeout(() => {
      this.user = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
      this.userCardPlaceholder = USER_CARD_TXT;
      this.APPOINTMENT_SUB = this.doctorAppointmentService
        .getAllAppointments(this.user.id)
        .subscribe((appointments) => {
          // need to do this because we want to leave the card as a generic component
          // refresh data if already exists - see if we can improve here
          this.appointmentList = [];
          this.appointmentMap = {};
          this.appointmentList = appointments;
          this.setAppointmentMap();
        });
    }, 300)

  }

  ngOnDestroy(): void {
    this.APPOINTMENT_SUB?.unsubscribe();
  }

  closeAppointmentDetails(): void {
    this.isUserCardClicked = false;
  }
  // todo : daca au depasit orele de munca? sau programarea a expirat?

  mapToCardData(appointment: any): ICardData {
    return {
      title: appointment.userName + ' - ' +appointment.phone,
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
      buttonData: {buttonId: appointment.animalData.uid, placeholder: this.userCardPlaceholder.buttonValue}
    };
  }

  openSectionWithAnimalDetails(animalId: string | number): void {
    // we do this because we want to let the card to be generic
    const selectedAppointment = this.appointmentList.find(appointment => appointment.animalData.uid === animalId);
    if (!selectedAppointment || !selectedAppointment.userId) {
      alert('No user found');
      return;
    }
    const userAnimalObs$ = this.animalService.getAnimalDataAndMedicalHistoryByAnimalId(animalId, selectedAppointment.userId);
    this.isUserCardClicked = true;
    this.userAnimalData = {
      userAnimalDataObs: userAnimalObs$,
      userId: selectedAppointment.userId
    }
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
