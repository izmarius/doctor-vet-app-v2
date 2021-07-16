import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {IDoctorsAppointmentsDTO} from "./dto/doctor-appointments-dto";
import {USER_CARD_TXT, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {DoctorAppointmentsService} from "./services/doctor-appointments.service";
import {AnimalService} from "./services/animal.service";
import {ICardData} from "../shared/user-card/user-card.component";

@Component({
  selector: 'app-doctor-appointments',
  templateUrl: './doctor-appointments.component.html',
  styleUrls: ['./doctor-appointments.component.css']
})
export class DoctorAppointmentsComponent implements OnInit {

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
    this.user = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.userCardPlaceholder = USER_CARD_TXT;
    this.APPOINTMENT_SUB = this.doctorAppointmentService
      .getAllAppointments(this.user.id)
      .subscribe((appointments) => {
        // need to do this because we want to leave the card as a generic component
        this.appointmentList = appointments;
        this.setAppointmentMap(appointments);
      });
  }

  ngOnDestroy(): void {
    this.APPOINTMENT_SUB?.unsubscribe();
  }

  closeAppointmentDetails(): void {
    this.isUserCardClicked = false;
  }

  mapToCardData(appointment: any): ICardData {
    return {
      title: appointment.userName,
      values: [appointment.services, appointment.dateTime, appointment.animalData.name],
      buttonId: appointment.animalData.uid
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

  setAppointmentMap(appointments: IDoctorsAppointmentsDTO[]): void {
    appointments.forEach((appointment) => {
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
