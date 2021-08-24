import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {APPOINTMENTFORM_DATA, INPUT_REGEX_TEXTS} from "../../shared-data/Constants";
import {DateUtilsService} from "../../data/utils/date-utils.service";

@Component({
  selector: 'app-user-appointment',
  templateUrl: './user-appointment.component.html',
  styleUrls: ['./user-appointment.component.css']
})
export class UserAppointmentDialogComponent implements OnInit {
  userAppointmentFormGroup!: FormGroup;
  userAppointmentFormText: any;
  stepMinutes: any = [0, 15, 30, 45];
  stepMinute: number = this.stepMinutes[0];
  stepHours: any = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  stepHour: number = this.stepHours[0];
  public minDate = new Date();

  constructor(private dateTimeUtils: DateUtilsService) {

  }

  ngOnInit(): void {
    this.userAppointmentFormText = APPOINTMENTFORM_DATA;
    this.initForm();
  }

  initForm() {
    this.userAppointmentFormGroup = new FormGroup({
      startDate: new FormControl(null, Validators.required),
      startTime: new FormControl(this.dateTimeUtils.formatTime(this.stepHour, this.stepMinute), Validators.required),
      service: new FormControl(null, Validators.required),
      animalName: new FormControl(null, Validators.required),
      county: new FormControl(null, Validators.required),
      location: new FormControl(null, Validators.required),
      patientEmail: new FormControl(null, [Validators.required, Validators.pattern(INPUT_REGEX_TEXTS.email)]),
    });
  }

  searchDoctorsByCountyAndLocation(): void {

  }

  onSubmitUserAppointment(): void {

  }
}
