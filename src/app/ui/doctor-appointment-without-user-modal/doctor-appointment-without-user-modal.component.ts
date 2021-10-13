import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {APPOINTMENTFORM_DATA, INPUT_REGEX_TEXTS, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {DateUtilsService} from "../../data/utils/date-utils.service";

@Component({
  selector: 'app-doctor-appointment-without-user-modal',
  templateUrl: './doctor-appointment-without-user-modal.component.html',
  styleUrls: ['./doctor-appointment-without-user-modal.component.scss']
})
export class DoctorAppointmentWithoutUserModalComponent implements OnInit {
  public appointmentWithoutUserForm!: FormGroup;
  stepMinutes: any
  stepMinute!: number;
  stepHours: any;
  stepHour!: number;
  public appointmentFormPlaceHolder: any;
  doctor: any;
  public minDate = new Date();
  planModel: any = {start_time: new Date()};
  public doctorServiceList: string[] = [];
  public errorMessage: string = '';
  public isErrorDisplayed: boolean = false;

  constructor(private dialogRef: MatDialogRef<DoctorAppointmentWithoutUserModalComponent>,
              private dateTimeUtils: DateUtilsService,
  ) {
  }

  ngOnInit(): void {
    this.appointmentFormPlaceHolder = APPOINTMENTFORM_DATA;
    this.doctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.stepHours = this.doctor.appointmentFrequency.hourIntervals;
    this.stepMinutes = this.doctor.appointmentFrequency.minuteIntervals;
    this.setDateAndHoursToForm();
    for (let service in this.doctor.services) {
      this.doctorServiceList = this.doctorServiceList.concat(this.doctor.services[service]);
    }
    this.initForm();
  }

  setDateAndHoursToForm() {
    this.stepHour = this.stepHours[0];
    this.stepMinute = this.stepMinutes[0];
  }

  initForm() {
    this.appointmentWithoutUserForm = new FormGroup({
      startDate: new FormControl(null, Validators.required),
      startTime: new FormControl(this.dateTimeUtils.formatTime(this.stepHour, this.stepMinute), Validators.required),
      medService: new FormControl(null, Validators.required),
      patientName: new FormControl(null, Validators.required),
    });
  }

  onCancelForm(): void {
    this.dialogRef.close();
  }

  onSubmitAppointmentWithoutUser(): void {

  }

}
