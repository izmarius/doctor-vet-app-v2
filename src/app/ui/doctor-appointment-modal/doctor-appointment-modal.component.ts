import {Component, OnInit, ViewChild} from '@angular/core';
import {IUserDTO} from "../user-profile/dto/user-dto";
import {AnimalUtilInfo, IAnimalUserInfo} from "../doctor-appointments/dto/animal-util-info";
import {DoctorsAppointmentDTO} from "../doctor-appointments/dto/doctor-appointments-dto";
import {DoctorService} from "../../services/doctor/doctor.service";
import {DoctorAppointmentsService} from "../doctor-appointments/services/doctor-appointments.service";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {APPOINTMENTFORM_DATA, INPUT_REGEX_TEXTS, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DoctorAppointmentFormService} from "./services/doctor-appointment-form.service";
import {MatDialogRef} from "@angular/material/dialog";
import {Subscription} from "rxjs";

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
  public selectedAnimal: any;
  public errorMessage: string = '';

  @ViewChild('patientList') patientListElem: any;
  @ViewChild('animalList') animalListElem: any;

  constructor(
    public dialogRef: MatDialogRef<DoctorAppointmentModalComponent>,
    private doctorService: DoctorService,
    private doctorAppointmentService: DoctorAppointmentsService,
    private appointmentFormService: DoctorAppointmentFormService,
    private dateTimeUtils: DateUtilsService
  ) {
  }

  ngOnInit(): void {
    // todo: set time in inputs to the closest hour possible that can be booked today - if current day -set to closest from dropdonw
    // if no hours available display message to user that today is out of work hours
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
      startTime: new FormControl(this.dateTimeUtils.formatTime(this.stepHour, this.stepMinute), Validators.required),
      medService: new FormControl(null, Validators.required),
      patientName: new FormControl(null, Validators.required),
      animalName: new FormControl(null, Validators.required),
      patientPhone: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.pattern(INPUT_REGEX_TEXTS.phoneNumber)]),
      patientEmail: new FormControl(null, [Validators.required, Validators.pattern(INPUT_REGEX_TEXTS.email)]),
    });
  }

  onSubmitAppointment(): void {
    this.validateTime();
    if (!this.appointmentForm.valid) {
      this.setErrorMessage(APPOINTMENTFORM_DATA.formAllFieldsValidMessage);
      return;
    }
    const newAnimalInfo = new AnimalUtilInfo()
      .setName(this.selectedAnimal.animalName);
    if (!this.isAnimalRegisteredToUser()) {
      // save animal to user - create new animal + insert in user animal name + id
      // todo: check animal subcolection if we have problems - create an appointment and get data
      newAnimalInfo.setUid(this.appointmentFormService.saveAnimal(this.selectedPatient, this.appointmentForm.value.animalName));
    } else {
      newAnimalInfo.setUid(this.selectedAnimal.animalId)
    }

    this.setErrorMessage('');


    const newDoctorAppointment = new DoctorsAppointmentDTO()
      .setUserName(this.appointmentForm.value.patientName)
      .setUserId(this.selectedPatient?.id)
      .setServices(this.appointmentForm.value.medService)
      .setDateTime(
        this.appointmentForm.value.startDate.toLocaleDateString() + ' - ' +
        this.appointmentForm.value.startTime
      )
      .setAnimal(newAnimalInfo)
      .setLocation(this.doctor.location)
      //todo: if patient is selected and exists in db
      .setUserEmail(this.selectedPatient.name)
      .setPhone(this.selectedPatient.phone)
      .setIsAppointmentFinished(false)
      .setIsConfirmedByDoctor(true);

    this.doctorAppointmentService.createAppointment(
      [newDoctorAppointment],
      this.doctor.id
    );
    alert(APPOINTMENTFORM_DATA.successAppointment);
    this.onCancelForm(true);
  }

  isAnimalRegisteredToUser(): boolean {
    if (this.animals.length !== 0) {
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
    const currentMinutes = currentTime.getMinutes();
    // todo check when doctor has last appointment - set in dropdown only available hours?
    // todo - add start hour/ end hour? - if doctor wants to block 2 hours for an appointment what he'll do?
    if (this.stepHour === null
      || this.stepMinute === null
      || !this.dateTimeUtils.isSelectedDateGreaterOrEqualComparedToCurrentDate(this.appointmentForm.value.startDate.toLocaleDateString())
      || (this.stepHour < currentHours && this.dateTimeUtils.isCurrentDay(this.appointmentForm.value.startDate.toLocaleDateString()))
      || (this.stepHour >= currentHours && this.stepMinute <= currentMinutes)) {
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
          subscription.unsubscribe();
          this.setErrorMessage('');
        }
        this.users = users;
      });
    }
  }

  filterAnimals(searchText: string): void {
    if (this.animals.length === 0) {
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
    if (this.selectedPatient && this.animals.length === 0) {
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

