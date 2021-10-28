import {Injectable} from '@angular/core';
import {FirestoreService} from "../../data/http/firestore.service";
import {DoctorsAppointmentDTO} from "../dto/doctor-appointments-dto";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AnimalAppointmentService} from "../../services/animal-appointment/animal-appointment.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {APPOINTMENTFORM_DATA, USER_CARD_TXT, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {MatDialog} from "@angular/material/dialog";
import {DoctorService} from "../../services/doctor/doctor.service";

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
              private dateUtils: DateUtilsService,
              private doctorService: DoctorService) {
  }

  createAppointment(doctorAppointmentDTO: DoctorsAppointmentDTO, doctorId: string, doctorAppointmentId: string): Promise<any> {
    return this.firestoreService.saveDocumentWithGeneratedFirestoreId(this.getAppointmentUrl(doctorId), doctorAppointmentId, JSON.parse(JSON.stringify(doctorAppointmentDTO)));
  }

  updateAppointment(app: any, appointmentId: string, doctorId: string): Promise<any> {

    return this.firestoreService.updateDocumentById(this.getAppointmentUrl(doctorId), appointmentId, app)
      .then(() => {
        // do something here
      }, (error) => {
        console.log('Appointment from doctor already was deleted so it cannot be updated', error);
      });
  }

  cancelAppointment(selectedAppointment: any, doctor: any, dialogRef: MatDialog): void {
    //todo maybe update also doctor's appointment instead of deleting it?
    Promise.all([
      this.doctorService.updateDoctorInfo({appointmentsMap: doctor.appointmentsMap}, doctor.id),
      this.deleteAppointment(selectedAppointment.id, doctor.id),
      this.animalAppointment.updateAnimalAppointment({isCanceled: true}, selectedAppointment.userId, selectedAppointment.animalAppointmentId)
    ]).then(() => {
      localStorage.removeItem(USER_LOCALSTORAGE);
      localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(doctor));
      dialogRef.closeAll();
      this.uiAlertInterceptor.setUiError({
        message: USER_CARD_TXT.cancelAppointmentSuccess,
        class: 'snackbar-success'
      });
      // todo notify user
    }).catch((error) => {
      this.uiAlertInterceptor.setUiError({message: USER_CARD_TXT.cancelAppointmentError, class: 'snackbar-success'});
      console.log(error);
    })
  }

  cancelAnimalAppointmentByUser(selectedAppointment: any, doctor: any): Promise<any> {
    //todo maybe update also doctor's appointment instead of deleting it?
    return this.animalAppointment.deleteAppointment(selectedAppointment.id).then((res) => {
      this.updateAppointment(
        {isCanceledByUser: true},
        selectedAppointment.doctorAppointmentId,
        selectedAppointment.doctorId)
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
    const timestamps = this.dateUtils.getDateFromOneMonthAgo();
    // todo - get appointments from 1 month ago
    return this.firestoreService.getCollectionByMultipleWhereClauses(this.getAppointmentUrl(doctorId), timestamps)
      .pipe(
        map((appointmentsSnaps) => {
          this.appointmentList = [];
          appointmentsSnaps.map((snap: any) => {
            const appointment = snap.payload.doc.data();
            // todo DEBUGG HERE TEST WITH 01 IN DATE / TIME PARAMETERS
            let appointmentDate = new Date(new Date(appointment['dateTime'].split('-')[0].trim()));
            const hour = parseInt(appointment['dateTime'].split('-')[1].trim().split(':')[0], 10)
            const minute = parseInt(appointment['dateTime'].split('-')[1].trim().split(':')[1], 10)
            appointmentDate.setHours(hour, minute);
            this.appointmentList = [...this.appointmentList,
              {
                // todo add phone number + animal info view
                start: new Date(appointmentDate), // cant use DTO methods, why??
                title:
                  'Ora: ' + appointment['dateTime'].split('-')[1].trim()
                  + ', '
                  + 'Client: ' + appointment.userName
                  + ', '
                  + 'Tel: ' + appointment.phone
                  + ', '
                  + 'Animal: ' + appointment.animalData?.name
                  + ', '
                  + appointment.services,
                animalId: appointment.animalData?.uid,
                userId: appointment.userId,
                appointment: appointment,
                appointmentId: snap.payload.doc.id
              }
            ];
          });
          return this.appointmentList;
        })
      )
  }

  isFreeDayForDoctor(schedule: any, appointmentNewStartDate: Date): boolean {
    // todo this should not depend on the appointment form, only on date and schedule - also is wrong to check only saturnday and sunday - what if doctor works on saturday/sunday?
    let isOutOfOfficeDay = false;
    for (const day in schedule) {
      if (!schedule[day].isChecked && schedule[day].dayNumber === appointmentNewStartDate.getDay()) {
        isOutOfOfficeDay = true;
        break;
      }
    }

    if (isOutOfOfficeDay) {
      this.uiAlertInterceptor.setUiError({
        message: APPOINTMENTFORM_DATA.wrongStartDate,
        class: 'snackbar-error'
      });
    }

    return isOutOfOfficeDay;
  }

  areAppointmentsOverlapping(date: Date, doctor: any): boolean {
    const startTimestamp = date.getTime()
    const endTimestamp = date.getTime() + (doctor.appointmentInterval * 60000);

    const appointmentDate = date.toLocaleDateString();
    if (!doctor.appointmentsMap[appointmentDate]) {
      doctor.appointmentsMap[appointmentDate] = [];
      doctor.appointmentsMap[appointmentDate].push({startTimestamp, endTimestamp});
      return false;
    }

    let overlappingAppointment = doctor.appointmentsMap[appointmentDate].find((interval: any) => {
      return startTimestamp >= interval.startTimestamp && startTimestamp < interval.endTimestamp;
    });

    if (overlappingAppointment) {
      this.uiAlertInterceptor.setUiError({
        message: 'O programare exista deja in acest interval orar.',
        class: 'snackbar-error'
      });
      return true;
    }

    doctor.appointmentsMap[appointmentDate].push({startTimestamp, endTimestamp});
    return false;
  }
}
