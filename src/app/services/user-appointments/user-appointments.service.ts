import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {IAppointmentDto} from "../appointments/appointment-dto";
import {AppointmentsService} from "../appointments/appointments.service";
import {USER_LOCALSTORAGE} from "../../shared-data/Constants";

@Injectable({
  providedIn: 'root'
})
export class UserAppointmentsService {

  private userAppointments: BehaviorSubject<IAppointmentDto[] | null>;
  public userAppointmentsObs$: Observable<IAppointmentDto[] | null>;
  private isInitialLoad = true;


  constructor(private appointmentsService: AppointmentsService) {
    // @ts-ignore
    this.userAppointments = new BehaviorSubject<IAppointmentDto>(null);
    this.userAppointmentsObs$ = this.userAppointments.asObservable();
    if (this.isInitialLoad) {
      this.getUserAppointmentsService();
    }
  }

  getUserAppointmentsService() {
    const user = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.appointmentsService.getAllCurrentUserAppointments(user).subscribe((res) => {
      this.setUserAppointments(res);
    })
  }

  setUserAppointments(userAppointment: IAppointmentDto[]) {
    this.userAppointments.next(userAppointment);
  }
}
