import {Component, OnInit, ViewChild} from '@angular/core';
import {IUserDTO} from "../user-profile/dto/user-dto";
import {AnimalUtilInfo} from "../doctor-appointments/dto/animal-util-info";
import {DoctorsAppointmentDTO} from "../doctor-appointments/dto/doctor-appointments-dto";
import {DoctorService} from "../../services/doctor/doctor.service";
import {DoctorAppointmentsService} from "../doctor-appointments/services/doctor-appointments.service";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {APPOINTMENTFORM_DATA, INPUT_REGEX_TEXTS, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {DoctorAppointmentFormService} from "./services/doctor-appointment-form.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-doctor-appointment-modal',
  templateUrl: './doctor-appointment-modal.component.html',
  styleUrls: ['./doctor-appointment-modal.component.css']
})
export class DoctorAppointmentModalComponent implements OnInit {
  // add minutes and hours depending on the schedule
  stepMinutes: any = [0, 15, 30, 45];
  stepMinute: number = this.stepMinutes[0];
  stepHours: any = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  stepHour: number = this.stepHours[0];
  public appointmentForm!: FormGroup;
  public users!: Observable<any>;
  public animals!: AnimalUtilInfo[];
  public doctorAppointment!: DoctorsAppointmentDTO;
  public appointmentFormPlaceHolder: any;
  public doctor: any;
  public doctorServiceList: string[] = [];
  public isErrorDisplayed: boolean = false;
  public minDate = new Date();
  public selectedPatient!: IUserDTO;

  @ViewChild('patientList') patientList: any;
  @ViewChild('inputPatientName') inputPatientName: any;
  @ViewChild('animalList') animalList: any;

  constructor(
    public dialogRef: MatDialogRef<DoctorAppointmentModalComponent>,
    private doctorService: DoctorService,
    private doctorAppointmentService: DoctorAppointmentsService,
    private appointmentFormService: DoctorAppointmentFormService,
    private dateTimeUtils: DateUtilsService
  ) {
  }

  ngOnInit(): void {
    this.appointmentFormPlaceHolder = APPOINTMENTFORM_DATA;
    this.doctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    for (let service in this.doctor.services) {
      this.doctorServiceList = this.doctorServiceList.concat(this.doctor.services[service]);
    }
    this.initForm();
  }

  initForm() {
    this.appointmentForm = new FormGroup({
      startDate: new FormControl(null, Validators.required),
      startTime: new FormControl(null, Validators.required),
      medicName: new FormControl(this.doctor?.doctorName, Validators.required),
      medService: new FormControl(null, Validators.required),
      patientName: new FormControl(null, Validators.required),
      patientId: new FormControl(null, Validators.required),
      patientAnimal: new FormControl(null, Validators.required),
      patientPhone: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.pattern(INPUT_REGEX_TEXTS.phoneNumber)]),
      patientEmail: new FormControl(null, [Validators.required, Validators.pattern(INPUT_REGEX_TEXTS.email)]),
    });
  }

  onSubmit(): void {
    this.validateTime();
    if (!this.appointmentForm.valid) {
      this.isErrorDisplayed = true;
      return;
    }
    this.isErrorDisplayed = false;
    const newAnimalInfo = new AnimalUtilInfo()
      .setName(this.appointmentForm.value.patientAnimal.animalName)
      .setUid(this.appointmentForm.value.patientAnimal.animalId);

    const newDoctorAppointment = new DoctorsAppointmentDTO()
      .setUserName(this.appointmentForm.value.patientName.value)
      .setUserId(this.appointmentForm.value.patientId.value)
      .setServices(this.appointmentForm.value.medService.value)
      .setDateTime(
        this.appointmentForm.value.startDate.toLocaleDateString() + ' - ' +
        this.appointmentForm.value.startTime
      )
      .setAnimal(newAnimalInfo)
      .setLocation(this.doctor.location)
      .setUserEmail(this.selectedPatient.name)
      .setPhone(this.selectedPatient.phone)
      .setIsAppointmentFinished(false)
      .setIsConfirmedByDoctor(true);

    this.doctorAppointmentService.createAppointment(
      [newDoctorAppointment],
      this.doctor.id
    );
  }

  validateTime(): void {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    // check when doctor has last appointment - set a dropdown with available hours?
    if (!this.stepHour || !this.stepMinute || (this.stepHour < currentHours && this.stepMinute < currentMinutes + 1)) {
      this.isErrorDisplayed = true;
      // todo add error message
      return;
    }
    this.appointmentForm.controls.startTime.setValue(this.dateTimeUtils.formatTime(this.stepHour, this.stepMinute));
  }

  onCancelForm(): void {
    this.dialogRef.close();
  }

  filterPatients(searchText: string): void {
    this.users = this.appointmentFormService.filterPatients(searchText);
  }

  onSelectPatient(selectedPatient: IUserDTO | any): void {
    this.selectedPatient = selectedPatient;
    this.patientList.nativeElement.classList.add('hide');
    this.animals = selectedPatient.animals;
    this.animalList.nativeElement.classList.remove('hide');
  }

  onFocusPatient(): void {
    if (this.patientList.nativeElement.classList.contains('hide')) {
      this.patientList.nativeElement.classList.remove('hide');
      return;
    }
    this.animalList.nativeElement.classList.add('hide');
  }
}

