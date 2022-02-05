import {Injectable} from '@angular/core';
import {FirestoreService} from "../../data/http/firestore.service";
import {UiErrorInterceptorService} from "../../ui/shared/alert-message/services/ui-error-interceptor.service";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {IAppointmentDto} from "./appointment-dto";
import {Observable} from "rxjs";
import {delay, map, take} from "rxjs/operators";
import {
  APPOINTMENT_CALENDAR_TAG, APPOINTMENTFORM_DATA,
  UI_ALERTS_CLASSES,
  USER_CARD_TXT,
  USER_LOCALSTORAGE
} from "../../shared-data/Constants";
import {FormGroup} from "@angular/forms";
import {DoctorDTO} from "../../data/model-dto/doctor-DTO";
import {MatDialog} from "@angular/material/dialog";
import {DoctorService} from "../doctor/doctor.service";
import {DoctorAppointmentsService} from "../../ui/services/doctor-appointments.service";

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private APPOINTMENT_COLLECTION = '/appointments';
  private APPOINTMENT_TAG_DELIMITER = ', ';

  constructor(private firestoreService: FirestoreService,
              private uiAlertInterceptor: UiErrorInterceptorService,
              private dateUtils: DateUtilsService,
              private doctorService: DoctorService,
              private doctorAppointmentsService: DoctorAppointmentsService,
              private uiAlertService: UiErrorInterceptorService) {
  }

  addRecurrentAppointment(period: string, doctor: any, userAnimalData: any) {
    let appointmentDate = new Date(userAnimalData.appointment.timestamp);
    if (period === 'day') {
      appointmentDate.setDate(appointmentDate.getDate() + 1);
    } else if (period === 'week') {
      appointmentDate.setDate(appointmentDate.getDate() + 14);
    } else if (period === 'month') {
      appointmentDate.setMonth(appointmentDate.getMonth() + 1);
    } else if (period === 'year') {
      appointmentDate.setFullYear(appointmentDate.getFullYear() + 1);
    } else {
      this.uiAlertInterceptor.setUiError({
        class: UI_ALERTS_CLASSES.ERROR,
        message: APPOINTMENTFORM_DATA.quickAppointmentError
      })
      return;
    }
    if (this.doctorAppointmentsService.isFreeDayForDoctor(doctor.schedule, appointmentDate)) {
      return;
    }
    const appointmentId = this.firestoreService.getNewFirestoreId();

    if (this.doctorAppointmentsService.areAppointmentsOverlapping(appointmentDate, doctor, appointmentId)) {
      return;
    }
    let appointment = Object.create(userAnimalData.appointment);
    appointment.timestamp = appointmentDate.getTime();
    const localeDate = this.dateUtils.getDateFormat(appointmentDate);
    const dateTime = appointment.dateTime.split(' ');
    appointment.dateTime = localeDate + ' ' + dateTime[1] + ' ' + dateTime[2];

    // save new appointment to animal and to doctor

    const appointmentDTO = this.getUserAnimalInfoAppointmentDTO(appointment, doctor, appointmentId);

    Promise.all([
      this.doctorService.updateDoctorInfo({appointmentsMap: doctor.appointmentsMap}, doctor.id),
      this.createAppointment(appointmentDTO),
    ]).then(() => {
      localStorage.removeItem(USER_LOCALSTORAGE);
      localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(doctor));
      this.uiAlertService.setUiError({
        message: APPOINTMENTFORM_DATA.successAppointment,
        class: UI_ALERTS_CLASSES.SUCCESS
      });
    }).catch((error: any) => {
      this.uiAlertService.setUiError({message: error.message, class: UI_ALERTS_CLASSES.ERROR});
      console.log('Error: ', error);
    });
  }

  createAppointment(appointmentDto: IAppointmentDto): Promise<any> {
    return this.firestoreService.saveDocumentWithGeneratedFirestoreId(this.APPOINTMENT_COLLECTION, appointmentDto.id, JSON.parse(JSON.stringify(appointmentDto)));
  }

  cancelAppointmentByDoctor(selectedAppointment: any, doctor: any, dialogRef: MatDialog, doctorAppointmentsMap: any): void {
    Promise.all([
      this.doctorService.updateDoctorInfo({appointmentsMap: doctorAppointmentsMap.__proto__}, doctor.id),
      this.updateAppointment({isCanceledByDoctor: true}, selectedAppointment.id),
    ]).then(() => {
      doctor.appointmentsMap = doctorAppointmentsMap.__proto__
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
      console.error(error);
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
      console.error(error);
    })
  }

  deleteAppointment(appointmentId: string): Promise<any> {
    return this.firestoreService.deleteDocById(this.APPOINTMENT_COLLECTION, appointmentId)
  }

  getAllCurrentUserAppointments(userData: any) {
    const timestamps = this.dateUtils.setAndGetDateToFetch();
    return this.firestoreService.getCollectionByTimestampAndUserId(this.APPOINTMENT_COLLECTION, timestamps, 'userId', userData.id);
  }

  getDoctorAppointments(): Observable<any> {
    const timestamps = this.dateUtils.getDateFromOneMonthAgo();
    // get appointments from 1 month ago
    return this.firestoreService.getCollectionByMultipleWhereClauses(this.APPOINTMENT_COLLECTION, timestamps)
      .pipe(
        map((appointmentsSnaps) => {
          let appointmentList: any[] = [];
          appointmentsSnaps.map((appSnap: any) => {
            if (appSnap.type == 'removed') {
              return;
            }
            // TODO when adding data to db returns duplicates - check
            const appointment = appSnap.payload.doc.data();
            let appointmentDate = new Date(new Date(appointment['dateTime'].split('-')[0].trim()));
            const hour = parseInt(appointment['dateTime'].split('-')[1].trim().split(':')[0], 10)
            const minute = parseInt(appointment['dateTime'].split('-')[1].trim().split(':')[1], 10)
            appointmentDate.setHours(hour, minute);
            appointmentList = [...appointmentList,
              {
                start: new Date(appointmentDate),
                title:
                  APPOINTMENT_CALENDAR_TAG.HOUR + appointment['dateTime'].split('-')[1].trim()
                  + this.APPOINTMENT_TAG_DELIMITER
                  + APPOINTMENT_CALENDAR_TAG.CLIENT + appointment.userName
                  + this.APPOINTMENT_TAG_DELIMITER
                  + APPOINTMENT_CALENDAR_TAG.PHONE + appointment.userPhone
                  + this.APPOINTMENT_TAG_DELIMITER
                  + APPOINTMENT_CALENDAR_TAG.ANIMAL + appointment.animalData.name
                  + this.APPOINTMENT_TAG_DELIMITER
                  + appointment.service,
                animalId: appointment.animalData.uid,
                userId: appointment.userId,
                appointment: appointment,
              }
            ];
          });
          return appointmentList;
        }),
      )
  }

  removeAppointmentFromAppointmentMap(doctorAppointmentsMap: any, appointment: any) {
    const appointmentsMap = Object.create(doctorAppointmentsMap);
    const date = appointment.dateTime.split('-')[0].trim();
    debugger;
    appointmentsMap[date].forEach((interval: any, index: number) => {
      if (interval.startTimestamp === appointment.timestamp && interval.appointmentId === appointment.id) {
        appointmentsMap[date].splice(index, 1);
        return;
      }
    });
    if (appointmentsMap[date].length === 0) {
      delete appointmentsMap[date];
    }
    return appointmentsMap;
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
        console.error('Appointment from doctor already was deleted so it cannot be updated', error);
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
    appointmentDTO.animalData = appointmentAnimalData;
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
    appointmentDTO.location = doctorDetails.doctor.location;
    appointmentDTO.service = doctorDetails.service;
    appointmentDTO.timestamp = doctorDetails.timestamp;
    appointmentDTO.userPhone = this.setAndGetUserPhoneNumber(user?.phone);
    appointmentDTO.userEmail = user.email;

    return appointmentDTO;
  }


  getUserAnimalInfoAppointmentDTO(appointmentInfo: any, doctor: any, appointmentId: string): IAppointmentDto {
    let appointmentDTO: any = {};
    appointmentDTO.animalData = appointmentInfo.animalData;
    appointmentDTO.dateTime = appointmentInfo.dateTime;
    appointmentDTO.doctorId = doctor.id;
    appointmentDTO.doctorName = doctor.doctorName;
    appointmentDTO.id = appointmentId
    appointmentDTO.isHonored = true;
    appointmentDTO.isCanceledByDoctor = false;
    appointmentDTO.isCanceledByUser = false;
    appointmentDTO.isConfirmedByDoctor = true;
    appointmentDTO.isFinished = false;
    appointmentDTO.isUserCreated = true;
    appointmentDTO.isUserNotified = false;
    appointmentDTO.service = appointmentInfo.services;
    appointmentDTO.userName = appointmentInfo.userName;
    appointmentDTO.userEmail = appointmentInfo.userEmail;
    appointmentDTO.userId = appointmentInfo.userId;
    appointmentDTO.userPhone = this.setAndGetUserPhoneNumber(appointmentInfo?.phone);
    appointmentDTO.timestamp = appointmentInfo.timestamp;
    appointmentDTO.location = doctor.location;

    return appointmentDTO;
  }
}
