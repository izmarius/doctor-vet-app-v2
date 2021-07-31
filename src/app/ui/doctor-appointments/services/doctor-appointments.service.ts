import {Injectable} from '@angular/core';
import {FirestoreService} from "../../../data/http/firestore.service";
import {DoctorsAppointmentDTO, IDoctorsAppointmentsDTO} from "../dto/doctor-appointments-dto";
import {Observable} from "rxjs";
import {first, map} from "rxjs/operators";
import {convertSnapshots} from "../../../data/utils/firestore-utils.service";
import {AnimalAppointmentService} from "../../../services/animal-appointment/animal-appointment.service";

@Injectable({
  providedIn: 'root'
})
export class DoctorAppointmentsService {
  private DOCTOR_COLLECTION = 'doctors/';
  private APPOINTMENT_COLLECTION = '/appointments';
  private appointmentList: any[] = [];

  constructor(private firestoreService: FirestoreService,
              private animalAppointment: AnimalAppointmentService) {
  }

  getAllAppointments(doctorId: string): Observable<IDoctorsAppointmentsDTO[]> {
    return this.firestoreService.getCollection(this.getAppointmentUrl(doctorId)).pipe(
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
      // update animal appointment isCanceled
      this.animalAppointment.updateAnimalAppointment(
        {isCanceled: true},
        selectedAppointment.userId,
        selectedAppointment.animalData.uid,
        selectedAppointment.animalAppointmentId)
        .then(() => {
          // todo alert message and notify user
        });
    }).catch((error) => {
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
