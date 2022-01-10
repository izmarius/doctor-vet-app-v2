import {Injectable} from '@angular/core';
import {FirestoreService} from "../../data/http/firestore.service";
import {UiErrorInterceptorService} from "../../ui/shared/alert-message/services/ui-error-interceptor.service";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {IAppointmentDto} from "./appointment-dto";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {
  APPOINTMENT_CALENDAR_TAG,
  UI_ALERTS_CLASSES,
  USER_CARD_TXT,
  USER_LOCALSTORAGE
} from "../../shared-data/Constants";
import {FormGroup} from "@angular/forms";
import {DoctorDTO} from "../../data/model-dto/doctor-DTO";
import {MatDialog} from "@angular/material/dialog";
import {DoctorService} from "../doctor/doctor.service";

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private APPOINTMENT_COLLECTION = '/appointments';
  private APPOINTMENT_TAG_DELIMITER = ', ';

  constructor(private firestoreService: FirestoreService,
              private uiAlertInterceptor: UiErrorInterceptorService,
              private dateUtils: DateUtilsService,
              private doctorService: DoctorService) {
  }

  createAppointment(appointmentDto: IAppointmentDto): Promise<any> {
    return this.firestoreService.saveDocumentWithGeneratedFirestoreId(this.APPOINTMENT_COLLECTION, appointmentDto.id, JSON.parse(JSON.stringify(appointmentDto)));
  }

  cancelAppointmentByDoctor(selectedAppointment: any, doctor: any, dialogRef: MatDialog, doctorAppointmentsMap: any): void {
    Promise.all([
      this.doctorService.updateDoctorInfo({appointmentsMap: doctorAppointmentsMap}, doctor.id),
      this.updateAppointment({isCanceledByDoctor: true}, selectedAppointment.id),
    ]).then(() => {
      doctor.appointmentsMap = doctorAppointmentsMap
      localStorage.removeItem(USER_LOCALSTORAGE);
      localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(doctor));
      dialogRef.closeAll();
      this.uiAlertInterceptor.setUiError({
        message: USER_CARD_TXT.cancelAppointmentSuccess,
        class: UI_ALERTS_CLASSES.SUCCESS
      });
      // todo notify user
    }).catch((error) => {
      this.uiAlertInterceptor.setUiError({
        message: USER_CARD_TXT.cancelAppointmentError,
        class: UI_ALERTS_CLASSES.SUCCESS
      });
      console.log(error);
    })
  }

  cancelAnimalAppointmentByUser(selectedAppointment: any, doctor: any): Promise<any> {
    //todo maybe update also doctor's appointment instead of deleting it?
    this.setAppointmentFromAppointmentMapAsCanceledByUser(selectedAppointment, doctor);
    return Promise.all([
      this.doctorService.updateDoctorInfo({appointmentsMap: doctor.appointmentsMap}, doctor.id),
      this.updateAppointment({isCanceledByUser: true}, selectedAppointment.id)
    ]).then((res) => {
      this.uiAlertInterceptor.setUiError({
        message: USER_CARD_TXT.cancelAppointmentSuccess,
        class: UI_ALERTS_CLASSES.SUCCESS
        // todo notify user
      });
    }).catch((error) => {
      this.uiAlertInterceptor.setUiError({
        message: USER_CARD_TXT.cancelAppointmentError,
        class: UI_ALERTS_CLASSES.SUCCESS
      });
      console.log(error);
    })
  }

  deleteAppointment(appointmentId: string): Promise<any> {
    return this.firestoreService.deleteDocById(this.APPOINTMENT_COLLECTION, appointmentId)
  }

  getDoctorAppointments(): Observable<any> {
    const timestamps = this.dateUtils.getDateFromOneMonthAgo();
    let appointmentList: any[] = [];

    // todo - get appointments from 1 month ago
    return this.firestoreService.getCollectionByMultipleWhereClauses(this.APPOINTMENT_COLLECTION, timestamps)
      .pipe(
        map((appointmentsSnaps) => {
          appointmentList = [];
          appointmentsSnaps.map((snap: any) => {
            const appointment = snap.payload.doc.data();
            // todo DEBUGG HERE TEST WITH 01 IN DATE / TIME PARAMETERS
            let appointmentDate = new Date(new Date(appointment['dateTime'].split('-')[0].trim()));
            const hour = parseInt(appointment['dateTime'].split('-')[1].trim().split(':')[0], 10)
            const minute = parseInt(appointment['dateTime'].split('-')[1].trim().split(':')[1], 10)
            appointmentDate.setHours(hour, minute);
            appointmentList = [...appointmentList,
              {
                // todo add phone number + animal info view
                start: new Date(appointmentDate), // cant use DTO methods, why??
                title:
                  APPOINTMENT_CALENDAR_TAG.HOUR + appointment['dateTime'].split('-')[1].trim()
                  + this.APPOINTMENT_TAG_DELIMITER
                  + APPOINTMENT_CALENDAR_TAG.CLIENT + appointment.userName
                  + this.APPOINTMENT_TAG_DELIMITER
                  + APPOINTMENT_CALENDAR_TAG.PHONE + appointment.userPhone
                  + this.APPOINTMENT_TAG_DELIMITER
                  + APPOINTMENT_CALENDAR_TAG.ANIMAL + appointment.animalData?.name
                  + this.APPOINTMENT_TAG_DELIMITER
                  + appointment.service,
                animalId: appointment.animalData?.uid,
                userId: appointment.userId,
                appointment: appointment,
                appointmentId: snap.payload.doc.id
              }
            ];
          });
          return appointmentList;
        })
      )
  }

  private setAndGetUserPhoneNumber(phone: string) {
    const roPrefix = '+4';
    return phone && phone.length === 10 ? roPrefix + phone : '';
  }

  setAppointmentFromAppointmentMapAsCanceledByUser(appointment: any, doctor: any) {
    const date = appointment.dateTime.split('-')[0].trim();
    doctor.appointmentsMap[date].forEach((interval: any, index: number) => {
      if (interval.startTimestamp === appointment.timestamp) {
        interval.isCanceled = true;
        return;
      }
    });
  }

  private updateAppointment(app: any, appointmentId: string): Promise<any> {

    return this.firestoreService.updateDocumentById(this.APPOINTMENT_COLLECTION, appointmentId, app)
      .then(() => {
        // do something here
      }, (error) => {
        console.log('Appointment from doctor already was deleted so it cannot be updated', error);
      });
  }


  //START DTOs

  getAppointmentDTO(appointmentAnimalData: any, appointmentForm: FormGroup, doctor: DoctorDTO, user: any, appointmentId: string): IAppointmentDto {
    let appointmentDTO: any = {};
    appointmentDTO.id = appointmentId;
    appointmentDTO.dateTime = this.dateUtils.getDateFormat(appointmentForm.value.startDate)
      + ' - ' +
      appointmentForm.value.startTime;
    appointmentDTO.userId = user?.id;
    appointmentDTO.userName = appointmentForm.value.patientName;
    appointmentDTO.doctorId = doctor.id;
    appointmentDTO.doctorName = doctor.doctorName;
    appointmentDTO.isHonored = true;
    appointmentDTO.isCanceledByDoctor = false;
    appointmentDTO.isCanceledByUser = false;
    appointmentDTO.isUserCreated = false;
    appointmentDTO.isConfirmedByDoctor = false;
    appointmentDTO.isFinished = false;
    appointmentDTO.isUserNotified = false;
    appointmentDTO.userPhone = this.setAndGetUserPhoneNumber(user?.phone);
    appointmentDTO.userEmail = user?.email;
    appointmentDTO.timestamp = appointmentForm.value.startDate.getTime();
    appointmentDTO.service = appointmentForm.value.medService;
    appointmentDTO.animalData = appointmentAnimalData;
    appointmentDTO.location = doctor.location;

    return appointmentDTO;
  }

  getDoctorAppointmentUserWithoutAccount(appointmentAnimalData: any, appointmentForm: FormGroup, doctor: DoctorDTO, user: any, appointmentId: string): IAppointmentDto {
    let appointmentDTO = this.getAppointmentDTO(appointmentAnimalData, appointmentForm, doctor, user, appointmentId)
    appointmentDTO.userPhone = appointmentForm.value.patientPhone;
    appointmentDTO.isConfirmedByDoctor = true;
    return appointmentDTO;
  }

  // TODO : only one method for doing an appoiintment

  getUserAppointmentDTO(appointmentAnimalData: any, doctorDetails: any, user: any, appointmentId: string): IAppointmentDto {
    let appointmentDTO: any = {};
    appointmentDTO.id = appointmentId;
    appointmentDTO.dateTime = doctorDetails.date;
    appointmentDTO.userName = user.name;
    appointmentDTO.userId = user.id;
    appointmentDTO.doctorId = doctorDetails.doctor.id;
    appointmentDTO.doctorName = doctorDetails.doctor.doctorName;
    appointmentDTO.isHonored = true;
    appointmentDTO.isCanceledByDoctor = false;
    appointmentDTO.isCanceledByUser = false;
    appointmentDTO.isUserCreated = true;
    appointmentDTO.isConfirmedByDoctor = true;
    appointmentDTO.isFinished = false;
    appointmentDTO.isUserNotified = false;
    appointmentDTO.userPhone = this.setAndGetUserPhoneNumber(user?.phone);
    appointmentDTO.userEmail = user.email;
    appointmentDTO.timestamp = doctorDetails.timestamp;
    appointmentDTO.service = doctorDetails.service;
    appointmentDTO.animalData = appointmentAnimalData;
    appointmentDTO.location = doctorDetails.doctor.location;

    return appointmentDTO;
  }


  getUserAnimalInfoAppointmentDTO(appointmentInfo: any, doctor: any, appointmentId: string): IAppointmentDto {
    let appointmentDTO: any = {};
    appointmentDTO.id = appointmentId
    appointmentDTO.dateTime = appointmentInfo.dateTime;
    appointmentDTO.userName = appointmentInfo.userName;
    appointmentDTO.userId = appointmentInfo.userId;
    appointmentDTO.doctorId = doctor.id;
    appointmentDTO.doctorName = doctor.doctorName;
    appointmentDTO.isHonored = true;
    appointmentDTO.isCanceledByDoctor = false;
    appointmentDTO.isCanceledByUser = false;
    appointmentDTO.isUserCreated = true;
    appointmentDTO.isConfirmedByDoctor = true;
    appointmentDTO.isFinished = false;
    appointmentDTO.isUserNotified = false;
    appointmentDTO.userPhone = this.setAndGetUserPhoneNumber(appointmentInfo?.phone);
    appointmentDTO.userEmail = appointmentInfo.userEmail;
    appointmentDTO.timestamp = appointmentInfo.timestamp;
    appointmentDTO.service = appointmentInfo.services;
    appointmentDTO.animalData = appointmentInfo.animalData;
    appointmentDTO.location = doctor.location;

    return appointmentDTO;
  }
}
