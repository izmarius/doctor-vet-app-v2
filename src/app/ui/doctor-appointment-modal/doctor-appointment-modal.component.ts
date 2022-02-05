import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {IUserDTO} from "../user-profile/dto/user-dto";
import {AnimalUtilInfo, IAnimalUserInfo} from "../dto/animal-util-info";
import {DoctorsAppointmentDTO} from "../dto/doctor-appointments-dto";
import {DoctorService} from "../../services/doctor/doctor.service";
import {DoctorAppointmentsService} from "../services/doctor-appointments.service";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {
  APPOINTMENTFORM_DATA,
  INPUT_REGEX_TEXTS,
  UI_ALERTS_CLASSES,
  USER_LOCALSTORAGE
} from "../../shared-data/Constants";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DoctorAppointmentFormService} from "./services/doctor-appointment-form.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {FirestoreService} from "../../data/http/firestore.service";
import {UserService} from "../user-profile/services/user.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {AppointmentsService} from "../../services/appointments/appointments.service";

@Component({
  selector: 'app-doctor-appointment-modal',
  templateUrl: './doctor-appointment-modal.component.html',
  styleUrls: ['./doctor-appointment-modal.component.scss']
})
export class DoctorAppointmentModalComponent implements OnInit {

  stepMinutes: any
  stepMinute!: number;
  stepHours: any;
  stepHour!: number;
  public appointmentForm!: FormGroup;
  public users!: IUserDTO[];
  public animals: IAnimalUserInfo[] = [];
  public filteredAnimals: IAnimalUserInfo[] = [];
  public doctorAppointment!: DoctorsAppointmentDTO;
  public appointmentFormPlaceHolder: any;
  public doctor: any;
  public doctorServiceList: string[] = [];
  public isErrorDisplayed: boolean = false;
  public minDate = new Date();
  public selectedPatient!: IUserDTO;
  public selectedAnimal: any = {};
  public errorMessage: string = '';
  selectedDate = new Date();


  @ViewChild('patientList') patientListElem: any;
  @ViewChild('animalList') animalListElem: any;

  constructor(
    private appointmentService: AppointmentsService,
    private appointmentFormService: DoctorAppointmentFormService,
    private dateTimeUtils: DateUtilsService,
    public dialogRef: MatDialogRef<DoctorAppointmentModalComponent>,
    private doctorService: DoctorService,
    private doctorAppointmentService: DoctorAppointmentsService,
    private firestoreService: FirestoreService,
    private userService: UserService,
    private uiAlertInterceptor: UiErrorInterceptorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
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

  initForm() {
    this.appointmentForm = new FormGroup({
      startDate: new FormControl(null, Validators.required),
      startTime: new FormControl(this.dateTimeUtils.formatTime(this.stepHour, this.stepMinute), Validators.required),
      medService: new FormControl(null, Validators.required),
      patientName: new FormControl(null, Validators.required),
      animalName: new FormControl(null, Validators.required),
      patientPhone: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.pattern(INPUT_REGEX_TEXTS.phoneNumber)]),
      patientEmail: new FormControl(null, [Validators.required, Validators.pattern(INPUT_REGEX_TEXTS.email)]),
    });
  }

  setDateAndHoursToForm() {
    this.stepHour = this.stepHours[0];
    this.stepMinute = this.stepMinutes[0];

    if (this.data) {
      this.stepHour = this.data.getHours();
      this.stepMinute = this.data.getMinutes();
      this.selectedDate = new Date(this.data);
    }
  }

  onStartDateChange(startDateChange: Date): void {
    if (this.doctorAppointmentService.isFreeDayForDoctor(this.doctor.schedule, startDateChange)) {
      this.appointmentForm.controls.startDate.setErrors({'incorrect': true});
    }
  }

  onSubmitAppointment(): void {
    this.validateTime();
    if (!this.appointmentForm.valid) {
      this.setErrorMessage(APPOINTMENTFORM_DATA.formAllFieldsValidMessage);
      return;
    }
    const appointmentId = this.firestoreService.getNewFirestoreId();
    this.appointmentForm.value.startDate.setHours(this.stepHour, this.stepMinute);
    if (this.doctorAppointmentService.areAppointmentsOverlapping(this.appointmentForm.value.startDate, this.doctor, appointmentId)) {
      return;
    }

    const newAnimalInfo = new AnimalUtilInfo()
      .setName(this.selectedAnimal.animalName);
// todo - leave it here or remove it and add to user list
    if (!this.isAnimalRegisteredToUser()) {
      const animalDocUID = this.firestoreService.getNewFirestoreId();
      this.selectedAnimal.animalId = animalDocUID;
      this.userService.saveAnimal(this.selectedPatient, this.appointmentForm.value.animalName, animalDocUID);
      newAnimalInfo.setUid(animalDocUID);
      newAnimalInfo.setName(this.appointmentForm.value.animalName);
    } else {
      newAnimalInfo.setUid(this.selectedAnimal.animalId)
    }

    this.setErrorMessage('');

    const appointmentDTO = this.appointmentService.getAppointmentDTO(newAnimalInfo, this.appointmentForm, this.doctor, this.selectedPatient, appointmentId);

    Promise.all([
      this.doctorService.updateDoctorInfo({appointmentsMap: this.doctor.appointmentsMap}, this.doctor.id),
      this.appointmentService.createAppointment(appointmentDTO),
    ]).then(() => {
      localStorage.removeItem(USER_LOCALSTORAGE);
      localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(this.doctor));
      this.uiAlertInterceptor.setUiError({
        message: APPOINTMENTFORM_DATA.successAppointment,
        class: UI_ALERTS_CLASSES.SUCCESS
      });
      this.onCancelForm(true);
    }).catch((error) => {
      this.uiAlertInterceptor.setUiError({message: error.message, class: UI_ALERTS_CLASSES.ERROR});
      console.error('Error: ', error);
    });
  }

  isAnimalRegisteredToUser(): boolean {
    if (this.animals && this.animals.length !== 0) {
      const filteredAnimals = this.animals.filter((animal) => {
        return animal.animalName === this.appointmentForm.value.animalName;
      });

      return filteredAnimals.length > 0;
    } else {
      return false;
    }
  }

  validateTime(): void {
    const currentTime = new Date();
    const currentHours = currentTime.getHours();
    // const currentMinutes = currentTime.getMinutes();
    if (this.stepHour === null
      || this.stepMinute === null
      || !this.dateTimeUtils.isSelectedDateGreaterOrEqualComparedToCurrentDate(this.dateTimeUtils.getDateFormat(this.appointmentForm.value.startDate))
      || (this.stepHour < currentHours && this.dateTimeUtils.isCurrentDay(this.dateTimeUtils.getDateFormat(this.appointmentForm.value.startDate)))) {
      // todo - refactor this - debug
      // || (this.stepHour <= currentHours && this.stepMinute <= currentMinutes)
      this.setErrorMessage(APPOINTMENTFORM_DATA.timeValidation);
      return;
    }
    this.setErrorMessage('');
    this.appointmentForm.controls.startTime.setValue(this.dateTimeUtils.formatTime(this.stepHour, this.stepMinute));
  }

  onCancelForm(isAppointmentSuccess: boolean): void {
    this.dialogRef.close(isAppointmentSuccess);
  }

  filterClients(searchText: string): void {
    // todo - filter patient after email?
    let subscription: Subscription;
    if (this.appointmentFormService.filterClients(searchText)) {
      subscription = this.appointmentFormService.filterClients(searchText).subscribe((users: any) => {
        if (searchText.length > 2 && users.length === 0) {
          this.setErrorMessage(APPOINTMENTFORM_DATA.patientDoesNotExist);
        } else {
          subscription?.unsubscribe();
          this.setErrorMessage('');
        }
        this.users = users;
      });
    }
  }

  filterAnimals(searchText: string): void {
    if (!this.animals || this.animals.length === 0) {
      this.selectedAnimal.animalName = searchText;
      this.isErrorDisplayed = false;
      return;
    }
    this.filteredAnimals = this.animals.filter((animal) => {
      return animal.animalName.toLowerCase().startsWith(searchText.toLowerCase());
    });
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

  onSelectPatient(selectedPatient: IUserDTO | any): void {
    this.selectedPatient = selectedPatient;
    this.appointmentForm.controls.patientName.setValue(selectedPatient.name);
    this.appointmentForm.controls.patientPhone.setValue(selectedPatient.phone);
    this.appointmentForm.controls.patientEmail.setValue(selectedPatient.email);
    this.patientListElem.nativeElement.classList.add('hide');
    this.animals = selectedPatient.animals;
    this.filteredAnimals = this.animals;
  }

  onSelectAnimal(animal: any): void {
    this.appointmentForm.controls.animalName.setValue(animal.animalName);
    this.selectedAnimal = animal;
    this.animalListElem.nativeElement.classList.add('hide');
  }

  onFocusAnimal(): void {
    if (this.selectedPatient && (!this.animals || this.animals.length === 0)) {
      this.setErrorMessage(APPOINTMENTFORM_DATA.userDoesNotHaveAnimal);
    }
    if (this.animalListElem.nativeElement.classList.contains('hide')) {
      this.animalListElem.nativeElement.classList.remove('hide');
    }
  }

  onFocusPatient(): void {
    if (this.patientListElem.nativeElement.classList.contains('hide')) {
      this.patientListElem.nativeElement.classList.remove('hide');
    }
  }
}

