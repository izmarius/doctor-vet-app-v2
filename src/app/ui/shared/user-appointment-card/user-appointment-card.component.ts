import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IAppointmentDto} from "../../../services/appointments/appointment-dto";

@Component({
  selector: 'app-user-appointment-card',
  templateUrl: './user-appointment-card.component.html',
  styleUrls: ['./user-appointment-card.component.scss']
})
export class UserAppointmentCardComponent implements OnInit {
  // @ts-ignore
  @Input() appointment: IAppointmentDto;
  @Output() cancelAppointmentEmitter = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  cancelAppointmentByUser(appointment: IAppointmentDto): void {
    this.cancelAppointmentEmitter.emit(appointment);
  }
}
