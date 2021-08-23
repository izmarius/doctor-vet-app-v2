import {Injectable} from '@angular/core';
import {FirestoreService} from "../../../data/http/firestore.service";
import {DoctorsAppointmentDTO, IDoctorsAppointmentsDTO} from "../dto/doctor-appointments-dto";
import {Observable} from "rxjs";
import {first, map} from "rxjs/operators";
import {convertSnapshots} from "../../../data/utils/firestore-utils.service";
import {AnimalAppointmentService} from "../../../services/animal-appointment/animal-appointment.service";
import {UiErrorInterceptorService} from "../../shared/alert-message/services/ui-error-interceptor.service";
import {USER_CARD_TXT} from "../../../shared-data/Constants";
import {DateUtilsService} from "../../../data/utils/date-utils.service";

@Injectable({
  providedIn: 'root'
})
export class DoctorAppointmentsService {
  private DOCTOR_COLLECTION = 'doctors/';
  private APPOINTMENT_COLLECTION = '/appointments';
  private appointmentList: any[] = [];

  constructor(private firestoreService: FirestoreService,
              private animalAppointment: AnimalAppointmentService,
              private uiAlertInterceptor: UiErrorInterceptorService,
              private dateUtils: DateUtilsService) {
  }

  getAllAppointments(doctorId: string): Observable<IDoctorsAppointmentsDTO[]> {
    return this.firestoreService.getCollection(this.getAppointmentUrl(doctorId)).pipe(
      map(snaps => convertSnapshots<IDoctorsAppointmentsDTO[]>(snaps)
      )
    );
    // firebase uses websocket to transfer data and first closes that connection after first value was transmited - for multiple tryes we will use take method
    // todo: subscribe in component
  }

  getAllCurrentAppointments(doctorId: string): Observable<IDoctorsAppointmentsDTO[]> {
    const timestamps = this.dateUtils.setAndGetDateToFetch();

    return this.firestoreService.getCollectionByMultipleWhereClauses(this.getAppointmentUrl(doctorId), timestamps).pipe(
      map(snaps => convertSnapshots<IDoctorsAppointmentsDTO[]>(snaps)
      )
    );
    // firebase uses websocket to transfer data and first closes that connection after first value was transmited - for multiple tryes we will use take method
    // todo: subscribe in component
  }


  getAppointmentById(appointmentId: string, doctorId: string): Observable<DoctorsAppointmentDTO> {
    return this.firestoreService.getDocById(this.getAppointmentUrl(doctorId), appointmentId);
    // todo: subscribe in component
  }

  createAppointment(doctorAppointmentDTO: DoctorsAppointmentDTO, doctorId: string, doctorAppointmentId: string): Promise<any> {
    return this.firestoreService.saveDocumentWithGeneratedFirestoreId(this.getAppointmentUrl(doctorId), doctorAppointmentId, JSON.parse(JSON.stringify(doctorAppointmentDTO)));
  }

  updateAppointment(app: DoctorsAppointmentDTO, appointmentId: string, doctorId: string): void {
    this.firestoreService.updateDocumentById(this.getAppointmentUrl(doctorId), appointmentId, app)
      .then(() => {
        // do something here
      }, (error) => {
        console.log('Error updating appointment', error);
      });
  }

  cancelAppointment(selectedAppointment: any, doctor: any): void {
    //todo maybe update also doctor's appointment instead of deleting it?
    this.deleteAppointment(selectedAppointment.id, doctor.id).then((res) => {
      this.animalAppointment.updateAnimalAppointment(
        {isCanceled: true},
        selectedAppointment.userId,
        selectedAppointment.id)
        .then(() => {
          this.uiAlertInterceptor.setUiError({
            message: USER_CARD_TXT.cancelAppointmentSuccess,
            class: 'snackbar-success'
          });
          // todo notify user
        });
    }).catch((error) => {
      this.uiAlertInterceptor.setUiError({message: USER_CARD_TXT.cancelAppointmentError, class: 'snackbar-success'});
      console.log(error);
    })
  }

  deleteAppointment(appointmentId: string, doctorId: string): Promise<any> {
    return this.firestoreService.deleteDocById(this.getAppointmentUrl(doctorId), appointmentId)
  }

  getAppointmentUrl(doctorId: string): string {
    return this.DOCTOR_COLLECTION + doctorId + this.APPOINTMENT_COLLECTION;
  }

  getDoctorAppointments(doctorId: string): Observable<any> {
    return this.getAllAppointments(doctorId).pipe(
      map((appointments) => {
        appointments.forEach((appointment) => {
          this.appointmentList = [...this.appointmentList,
            {
              start: new Date(appointment['dateTime']), // cant use DTO methods, why??
              title: appointment['services']
                + ', '
                + new Date(appointment['dateTime']).toLocaleTimeString('ro')
                + ', '
                + 'Pacient: '
                + appointment['userName']
                + ', '
                + 'Animal: '
                + appointment['animalData']['name']
            }
          ];
        });
        return this.appointmentList;
      })
    );
  }
}
