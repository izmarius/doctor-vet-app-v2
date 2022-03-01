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
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FirestoreService} from "../../data/http/firestore.service";
import {UserService} from "../user-profile/services/user.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {AppointmentsService} from "../../services/appointments/appointments.service";
import {UsersOfDoctorService} from "../../services/users-of-doctor/users-of-doctor.service";
import {take} from "rxjs/operators";
import {BatchService} from "../../services/batch/batch.service";

@Component({
  selector: 'app-doctor-appointment-modal',
  templateUrl: './doctor-appointment-modal.component.html',
  styleUrls: ['./doctor-appointment-modal.component.scss']
})
export class DoctorAppointmentModalComponent implements OnInit {

  public animals: IAnimalUserInfo[] = [];
  public appointmentForm!: FormGroup;
  public appointmentFormPlaceHolder: any;
  public doctor: any;
  public doctorAppointment!: DoctorsAppointmentDTO;
  public doctorServiceList: string[] = [];
  public errorMessage: string = '';
  public filteredAnimals: IAnimalUserInfo[] = [];
  public isErrorDisplayed: boolean = false;
  public minDate = new Date();
  public isSearchingByPhone: boolean = false;
  public selectedAnimal: any = {};
  selectedDate = new Date();
  public selectedPatient: any = {};
  stepMinutes: any
  stepMinute!: number;
  stepHours: any;
  stepHour!: number;
  public users!: IUserDTO[];
  @ViewChild('patientList') patientListElem: any;
  @ViewChild('animalList') animalListElem: any;

  constructor(
    private appointmentService: AppointmentsService,
    private batchService: BatchService,
    private dateTimeUtils: DateUtilsService,
    public dialogRef: MatDialogRef<DoctorAppointmentModalComponent>,
    private doctorService: DoctorService,
    private doctorAppointmentService: DoctorAppointmentsService,
    private firestoreService: FirestoreService,
    private userService: UserService,
    private usersOfDoctorService: UsersOfDoctorService,
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
    this.setUserAnimalData();
  }

  filterClients(nameOrPhone: string): void {
    if (!this.isSearchingByPhone) {
      this.usersOfDoctorService.filterUsersOfDoctors(nameOrPhone, '')
        .pipe(take(1))
        .subscribe((users: any) => {
          this.users = users;
        });
    } else {
      this.usersOfDoctorService.filterUsersOfDoctors('', nameOrPhone)
        .pipe(take(1))
        .subscribe((users: any) => {
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

  initForm() {
    this.appointmentForm = new FormGroup({
      startDate: new FormControl(null, Validators.required),
      startTime: new FormControl(this.dateTimeUtils.formatTime(this.stepHour, this.stepMinute), Validators.required),
      medService: new FormControl(null, Validators.required),
      patientName: new FormControl(null, Validators.required),
      animalName: new FormControl(null, Validators.required),
      patientPhone: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.pattern(INPUT_REGEX_TEXTS.phoneNumber)]),
      patientEmail: new FormControl(null, [Validators.pattern(INPUT_REGEX_TEXTS.email)]),
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

  onCancelForm(isAppointmentSuccess: boolean): void {
    this.dialogRef.close(isAppointmentSuccess);
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

  onSelectAnimal(animal: any): void {
    this.appointmentForm.controls.animalName.setValue(animal.animalName);
    this.selectedAnimal = animal;
    this.animalListElem.nativeElement.classList.add('hide');
  }

  onSelectPatient(selectedPatient: any): void {
    if (selectedPatient.isClientRegisteredInApp) {
      this.userService.getUserDataById(selectedPatient.clientId)
        .pipe(take(1))
        .subscribe((userData) => {
          this.selectedPatient = selectedPatient;
          this.selectedPatient.email = userData.email;
          this.appointmentForm.controls.patientName.setValue(userData.name);
          this.appointmentForm.controls.patientPhone.setValue(userData.phone);
          this.appointmentForm.controls.patientEmail.setValue(userData.email);
          this.patientListElem.nativeElement.classList.add('hide');
          this.animals = userData.animals;
          this.filteredAnimals = this.animals;
        });
    } else {
      this.selectedPatient = selectedPatient;
      this.appointmentForm.controls.patientName.setValue(selectedPatient.clientName);
      this.appointmentForm.controls.patientPhone.setValue(selectedPatient.clientPhone);
      this.appointmentForm.controls.patientEmail.setValue('');
      this.patientListElem.nativeElement.classList.add('hide');
      this.animals = selectedPatient.animals;
      this.filteredAnimals = this.animals;
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
      .setName(this.selectedAnimal.animalName)
      .setUid(this.selectedAnimal.animalId);

    if (!this.isAnimalRegisteredToUser()) {
      this.setErrorMessage(APPOINTMENTFORM_DATA.animalNeedsRegistration);
      return;
    }
    this.setErrorMessage('');
    const appointmentDTO = this.appointmentService.getAppointmentDTO(newAnimalInfo, this.appointmentForm, this.doctor, this.selectedPatient, appointmentId);

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
        this.onCancelForm(true);
      }).catch((error) => {
      this.uiAlertInterceptor.setUiError({message: error.message, class: UI_ALERTS_CLASSES.ERROR});
      console.error('Error: ', error);
    });
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

  setDateAndHoursToForm() {
    let appMinutes;
    let appHour;
    if (this.data.date.getMinutes() > 0 && this.data.date.getMinutes() < 30) {
      appMinutes = 30
      appHour = this.data.date.getHours();
    } else {
      appMinutes = 0;
      appHour = this.data.date.getHours() + 1;
    }
    this.data.date.setHours(appHour);
    this.data.date.setMinutes(appMinutes);
    this.stepHour = appHour;
    this.stepMinute = appMinutes;
    this.selectedDate = new Date(this.data.date);
  }

  setUserAnimalData() {
    if (this.data && this.data.userData && this.data.animalData) {
      this.appointmentForm.controls.patientName.setValue(this.data.userData.name);
      this.appointmentForm.controls.patientPhone.setValue(this.data.userData.phone);
      this.appointmentForm.controls.patientEmail.setValue(this.data.userData.email);
      this.appointmentForm.controls.animalName.setValue(this.data.animalData.name);
      this.animals = this.data.userData.animals;
      this.selectedAnimal.animalName = this.data.animalData.name;
      this.selectedAnimal.animalId = this.data.animalData.id;
      this.selectedPatient.clientId = this.data.userData.id;
      this.selectedPatient.email = this.data.userData.email;
      this.selectedPatient.clientPhone = this.data.userData.phone;
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
}

