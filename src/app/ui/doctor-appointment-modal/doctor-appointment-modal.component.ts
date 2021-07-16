import {Component, OnInit, ViewChild} from '@angular/core';
import {UserDTO} from "../user-profile/dto/user-dto";
import {AnimalUtilInfo} from "../doctor-appointments/dto/animal-util-info";
import {DoctorsAppointmentDTO} from "../doctor-appointments/dto/doctor-appointments-dto";
import {DoctorService} from "../../services/doctor/doctor.service";
import {DoctorAppointmentsService} from "../doctor-appointments/services/doctor-appointments.service";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {APPOINTMENTFORM_DATA, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {DoctorAppointmentFormService} from "./services/doctor-appointment-form.service";

@Component({
  selector: 'app-doctor-appointment-modal',
  templateUrl: './doctor-appointment-modal.component.html',
  styleUrls: ['./doctor-appointment-modal.component.css']
})
export class DoctorAppointmentModalComponent implements OnInit {
  public appointmentForm!: FormGroup;
  public formTitle: string = '';
  public patientName: string = '';
  public users!: Observable<any>;
  public animals!: AnimalUtilInfo[];
  public doctorAppointment!: DoctorsAppointmentDTO;
  public appointmentFormPlaceHolder: any;
  public doctor: any;
  public doctorServiceList: string[] = [];
  public isErrorDisplayed: boolean = false;
  @ViewChild('patientList') patientList: any;
  @ViewChild('inputPatientName') inputPatientName: any;
  @ViewChild('animalList') animalList: any;

  constructor(
    private doctorService: DoctorService,
    private doctorAppointmentService: DoctorAppointmentsService,
    private appointmentFormService: DoctorAppointmentFormService,
    private dateUtilsService: DateUtilsService
  ) {
  }

  ngOnInit(): void {
    this.appointmentFormPlaceHolder = APPOINTMENTFORM_DATA;
    this.formTitle = APPOINTMENTFORM_DATA.title;
    this.doctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    for (let service in this.doctor.services) {
      this.doctorServiceList = this.doctorServiceList.concat(this.doctor.services[service]);
    }
    this.initForm();
  }

  initForm() {
    this.appointmentForm = new FormGroup({
      // todo: set to date now
      startDate: new FormControl(null, Validators.required),
      startTime: new FormControl(null, Validators.required),
      medicId: new FormControl(null, Validators.required),
      medicName: new FormControl(this.doctor?.doctorName, Validators.required),
      medService: new FormControl(null, Validators.required),
      medLocation: new FormControl(null, Validators.required),
      patientName: new FormControl(null, Validators.required),
      patientId: new FormControl(null, Validators.required),
      patientAnimal: new FormControl(null, Validators.required),
    });
  }

  onSubmit(): void {
    const newAnimalInfo = new AnimalUtilInfo()
      .setName(this.appointmentForm.value.patientAnimal.animalName)
      .setUid(this.appointmentForm.value.patientAnimal.animalId);

    const newDoctorAppointment = new DoctorsAppointmentDTO()
      .setUserName(this.appointmentForm.value.patientName)
      .setUserId(this.appointmentForm.value.patientId)
      .setServices(this.appointmentForm.value.medService)
      .setDateTime(
        this.dateUtilsService.formatDateAndTime(
          this.appointmentForm.value.startDate,
          this.appointmentForm.value.startTime
        )
      )
      .setAnimal(newAnimalInfo)
      .setLocation(this.appointmentForm.value.medLocation);

    if (!this.appointmentForm.invalid) {
      this.doctorAppointmentService.createAppointment(
        [newDoctorAppointment],
        this.appointmentForm.value.medicId
      );
    }
  }

  onCancelForm(): void {

  }

  filterPatients(searchText: string): void {
    this.users = this.appointmentFormService.filterPatients(searchText, this.patientName);
  }

  onSelectPatient(selectedPatient: UserDTO | any): void {
    this.patientList.nativeElement.classList.add('hide');
    this.appointmentForm.patchValue({
      patientName: selectedPatient['name'],
      patientId: selectedPatient['id'],
    });
    this.animals = selectedPatient['animals'];
    this.animalList.nativeElement.classList.remove('hide');
  }

  onFocusPatient(): void {
    if (this.patientList.nativeElement.classList.contains('hide')) {
      this.patientList.nativeElement.classList.remove('hide');
    }
    this.animalList.nativeElement.classList.add('hide');
  }
}

