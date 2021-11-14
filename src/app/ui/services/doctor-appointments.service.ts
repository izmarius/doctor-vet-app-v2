import {Injectable} from '@angular/core';
import {FirestoreService} from "../../data/http/firestore.service";
import {DoctorsAppointmentDTO} from "../dto/doctor-appointments-dto";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AnimalAppointmentService} from "../../services/animal-appointment/animal-appointment.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {APPOINTMENTFORM_DATA, UI_ALERTS_CLASSES, USER_CARD_TXT, USER_LOCALSTORAGE} from "../../shared-data/Constants";
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
      this.animalAppointment.deleteAppointment(selectedAppointment.id),
      this.updateAppointment({isCanceledByUser: true}, selectedAppointment.doctorAppointmentId, selectedAppointment.doctorId)
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

  setAppointmentFromAppointmentMapAsCanceledByUser(appointment: any, doctor: any) {
    const date = appointment.dateTime.split('-')[0].trim();
    doctor.appointmentsMap[date].forEach((interval: any, index: number) => {
      if (interval.startTimestamp === appointment.timestamp) {
        interval.isCanceled = true;
        return;
      }
    });
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
    let isOutOfOfficeDay = false;
    let isOutOfWorkingHours = false;
    let outOfWorkingHoursTime;
    for (const day in schedule) {
      if (!schedule[day].isChecked && schedule[day].dayNumber === appointmentNewStartDate.getDay()) {
        isOutOfOfficeDay = true;
        break;
      } else if (day === 'monday-friday' && !schedule[day].isChecked && appointmentNewStartDate.getDay() < 6 && appointmentNewStartDate.getDay() > 0) {
        isOutOfOfficeDay = true;
        break;
      } else if (schedule[day].isChecked) {
        const isDoctorWorkingAtThisHour = this.hasDoctorScheduleAtThisHour(schedule[day], appointmentNewStartDate);
        if (!isDoctorWorkingAtThisHour && schedule[day].dayNumber === appointmentNewStartDate.getDay()) {
          isOutOfWorkingHours = true;
          isOutOfOfficeDay = true;
          outOfWorkingHoursTime = schedule[day].endTime;
          break;
        } else if(day === 'monday-friday' && !isDoctorWorkingAtThisHour && appointmentNewStartDate.getDay() < 6 && appointmentNewStartDate.getDay() > 0) {
          isOutOfWorkingHours = true;
          isOutOfOfficeDay = true;
          outOfWorkingHoursTime = schedule[day].endTime;
          break;
        }
      }
    }

    if (isOutOfOfficeDay) {
      this.uiAlertInterceptor.setUiError({
        message: isOutOfWorkingHours ?
          APPOINTMENTFORM_DATA.outOfWorkingOfficeWarning[0] + outOfWorkingHoursTime + APPOINTMENTFORM_DATA.outOfWorkingOfficeWarning[1] :
          APPOINTMENTFORM_DATA.wrongStartDate,
        class: UI_ALERTS_CLASSES.ERROR
      });
    }

    return isOutOfOfficeDay;
  }

  hasDoctorScheduleAtThisHour(daySchedule: any, selectedDate: Date): boolean {
    const selectedHour = selectedDate.getHours();
    const selectedMinutes = selectedDate.getMinutes();
    const doctorDayEndHour = parseInt(daySchedule.endTime.split(':')[0]);
    const doctorDayEndMinutes = parseInt(daySchedule.endTime.split(':')[1]);
    if (selectedHour > doctorDayEndHour) {
      return false;
    } else if (selectedHour === doctorDayEndHour && selectedMinutes >= doctorDayEndMinutes) {
      return false;
    }
    return true;
  }

  areAppointmentsOverlapping(date: Date, doctor: any, appointmentId: string): boolean {
    const startTimestamp = date.getTime()
    const endDate = new Date(date);
    endDate.setMinutes(date.getMinutes() + doctor.appointmentInterval);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);
    const endTimestamp = endDate.getTime();

    const appointmentDate = this.dateUtils.getDateFormat(date);
    if (!doctor.appointmentsMap[appointmentDate]) {
      doctor.appointmentsMap[appointmentDate] = [];
      doctor.appointmentsMap[appointmentDate].push({startTimestamp, endTimestamp, appointmentId});
      return false;
    }
    let overlappingAppointment = doctor.appointmentsMap[appointmentDate].find((interval: any) => {
      return startTimestamp >= interval.startTimestamp && startTimestamp < interval.endTimestamp && !interval.isCanceled;
    });

    if (overlappingAppointment) {
      this.uiAlertInterceptor.setUiError({
        message: 'O programare exista deja in acest interval orar.',
        class: UI_ALERTS_CLASSES.ERROR
      });
      return true;
    }

    doctor.appointmentsMap[appointmentDate].push({startTimestamp, endTimestamp, appointmentId});
    return false;
  }
}
