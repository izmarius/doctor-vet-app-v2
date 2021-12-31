import {Injectable} from '@angular/core';
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {APPOINTMENTFORM_DATA, UI_ALERTS_CLASSES,} from "../../shared-data/Constants";
import {DateUtilsService} from "../../data/utils/date-utils.service";

@Injectable({
  providedIn: 'root'
})
export class DoctorAppointmentsService {

  constructor(private uiAlertInterceptor: UiErrorInterceptorService,
              private dateUtils: DateUtilsService) {
  }

  isFreeDayForDoctor(schedule: any, appointmentNewStartDate: Date): boolean {
    let isOutOfOfficeDay = false;

    for (const day in schedule) {
      if (!schedule[day].isChecked && schedule[day].dayNumber === appointmentNewStartDate.getDay()) {
        isOutOfOfficeDay = true;
        break;
      } else if (day === 'monday-friday' && !schedule[day].isChecked && appointmentNewStartDate.getDay() < 6 && appointmentNewStartDate.getDay() > 0) {
        isOutOfOfficeDay = true;
        break;
      }
    }

    if (isOutOfOfficeDay) {
      this.uiAlertInterceptor.setUiError({
        message: APPOINTMENTFORM_DATA.wrongStartDate,
        class: UI_ALERTS_CLASSES.ERROR
      });
    }

    return isOutOfOfficeDay;
  }

  checkWorkingDaysIfHourIsSetOutOfSchedule(schedule: any, appointmentNewStartDate: Date): boolean {
    let isOutOfWorkingHours = false;
    let outOfWorkingHoursTime;
    // todo - combine with validateTime method
    for (const day in schedule) {
      if (schedule[day].isChecked) {
        const isDoctorWorkingAtThisHour = this.hasDoctorScheduleAtThisHour(schedule[day], appointmentNewStartDate);
        if (!isDoctorWorkingAtThisHour && schedule[day].dayNumber === appointmentNewStartDate.getDay()) {
          isOutOfWorkingHours = true;
          outOfWorkingHoursTime = schedule[day].endTime;
        } else if (day === 'monday-friday' && !isDoctorWorkingAtThisHour && appointmentNewStartDate.getDay() < 6 && appointmentNewStartDate.getDay() > 0) {
          isOutOfWorkingHours = true;
          outOfWorkingHoursTime = schedule[day].endTime;
        }
      }
    }

    if (isOutOfWorkingHours) {
      this.uiAlertInterceptor.setUiError({
        message: APPOINTMENTFORM_DATA.outOfWorkingOfficeWarning[0] + outOfWorkingHoursTime + APPOINTMENTFORM_DATA.outOfWorkingOfficeWarning[1],
        class: UI_ALERTS_CLASSES.ERROR
      });
    }

    return isOutOfWorkingHours;
  }

  private hasDoctorScheduleAtThisHour(daySchedule: any, selectedDate: Date): boolean {
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
