import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-user-appointment-card',
  templateUrl: './user-appointment-card.component.html',
  styleUrls: ['./user-appointment-card.component.css']
})
export class UserAppointmentCardComponent implements OnInit {
  @Input() appointment: any;
  @Output() cancelAppointmentEmitter = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  cancelAppointmentByUser(appointment: any): void {
    this.cancelAppointmentEmitter.emit(appointment);
  }
}
