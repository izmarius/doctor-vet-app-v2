import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {
  APPOINTMENTFORM_DATA,
  INPUT_REGEX_TEXTS,
  UI_ALERTS_CLASSES,
  USER_LOCALSTORAGE
} from "../../shared-data/Constants";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {DoctorAppointmentsService} from "../services/doctor-appointments.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {FirestoreService} from "../../data/http/firestore.service";
import {DoctorService} from "../../services/doctor/doctor.service";
import {AppointmentsService} from "../../services/appointments/appointments.service";
import {BatchDocuments} from "../../services/batch/BatchInterface";
import {BatchService} from "../../services/batch/batch.service";

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

  constructor(private appointmentService: AppointmentsService,
              private batchService: BatchService,
              private dialogRef: MatDialogRef<DoctorAppointmentWithoutUserModalComponent>,
              private dateTimeUtils: DateUtilsService,
              private doctorAppointmentService: DoctorAppointmentsService,
              private doctorService: DoctorService,
              private firestoreService: FirestoreService,
              private uiAlertInterceptor: UiErrorInterceptorService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
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
    this.setAppointmentFormDefaultValuesIfModalDataExists();
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
      patientPhone: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.pattern(INPUT_REGEX_TEXTS.phoneNumber)]),
    });
  }


  onCancelForm(): void {
    this.dialogRef.close();
  }

  onStartDateChange(startDateChange: Date): void {
    if (this.doctorAppointmentService.isFreeDayForDoctor(this.doctor.schedule, startDateChange)) {
      this.appointmentWithoutUserForm.controls.startDate.setErrors({'incorrect': true});
    }
  }

  onSubmitAppointmentWithoutUser(): void {
    this.validateTime();
    if (!this.appointmentWithoutUserForm.valid) {
      this.setErrorMessage(APPOINTMENTFORM_DATA.formAllFieldsValidMessage);
      return;
    }
    const appointmentId = this.firestoreService.getNewFirestoreId();

    this.appointmentWithoutUserForm.value.startDate.setHours(this.stepHour, this.stepMinute);
    if (this.doctorAppointmentService.areAppointmentsOverlapping(this.appointmentWithoutUserForm.value.startDate, this.doctor, appointmentId)) {
      return;
    }
    const appointmentDTO = this.appointmentService.getDoctorAppointmentUserWithoutAccount(this.data.animalData, this.appointmentWithoutUserForm, this.doctor, this.data.userOfDoctor, appointmentId);


    const appointmentBatchDoc = this.batchService.getMapper('appointments', appointmentId, JSON.parse(JSON.stringify(appointmentDTO)), 'set');
    const doctorBatchDocument = this.batchService.getMapper('doctors', this.doctor.id, {appointmentsMap: this.doctor.appointmentsMap}, 'update');
    this.batchService.createBatch([appointmentBatchDoc, doctorBatchDocument])
      .then(() => {
        localStorage.removeItem(USER_LOCALSTORAGE);
        localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(this.doctor));
        this.uiAlertInterceptor.setUiError({
          message: APPOINTMENTFORM_DATA.successAppointment,
          class: UI_ALERTS_CLASSES.SUCCESS
        });
        this.dialogRef.close();
      }).catch((error) => {
      this.uiAlertInterceptor.setUiError({message: error.message, class: UI_ALERTS_CLASSES.ERROR});
      console.error('Error: ', error);
    })
  }

  setAppointmentFormDefaultValuesIfModalDataExists() {
    if (this.data && this.data.userOfDoctor) {
      this.appointmentWithoutUserForm.controls.patientName.setValue(this.data.userOfDoctor.name);
      this.appointmentWithoutUserForm.controls.patientPhone.setValue(this.data.userOfDoctor.phone);
    }
  }

  setErrorMessage(value: string): void {
    if (!value) {
      this.isErrorDisplayed = false;
      this.errorMessage = value;
    } else {
      this.isErrorDisplayed = true;
      this.errorMessage = value;
      throw value;
    }
  }

  validateTime(): void {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    // const currentMinutes = currentTime.getMinutes();
    // todo check when doctor has last appointment - set in dropdown only available hours?
    // todo - add start hour/ end hour? - if doctor wants to block 2 hours for an appointment what he'll do?
    if (this.stepHour === null
      || this.stepMinute === null
      || !this.dateTimeUtils.isSelectedDateGreaterOrEqualComparedToCurrentDate(this.dateTimeUtils.getDateFormat(this.appointmentWithoutUserForm.value.startDate))
      || (this.stepHour < currentHours && this.dateTimeUtils.isCurrentDay(this.dateTimeUtils.getDateFormat(this.appointmentWithoutUserForm.value.startDate)))) {
      // todo - refactor this - debugg
      // || (this.stepHour <= currentHours && this.stepMinute <= currentMinutes)
      this.setErrorMessage(APPOINTMENTFORM_DATA.timeValidation);
      return;
    }
    this.setErrorMessage('');
    this.appointmentWithoutUserForm.controls.startTime.setValue(this.dateTimeUtils.formatTime(this.stepHour, this.stepMinute));
  }
}
