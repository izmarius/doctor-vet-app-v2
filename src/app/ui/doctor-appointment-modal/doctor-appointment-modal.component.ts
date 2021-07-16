import {Component, OnInit, ViewChild} from '@angular/core';
import {UserDTO} from "../user-profile/dto/user-dto";
import {AnimalUtilInfo} from "../doctor-appointments/dto/animal-util-info";
import {DoctorDTO} from "../../data/model-dto/doctor-DTO";
import {DoctorsAppointmentDTO} from "../doctor-appointments/dto/doctor-appointments-dto";
import {DoctorService} from "../../services/doctor/doctor.service";
import {DoctorServicesService} from "../../services/doctor-service/doctor-services.service";
import {DoctorAppointmentsService} from "../doctor-appointments/services/doctor-appointments.service";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {APPOINTMENTFORM_DATA} from "../../shared-data/Constants";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {DoctorAppointmentFormService} from "./services/doctor-appointment-form.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-doctor-appointment-modal',
  templateUrl: './doctor-appointment-modal.component.html',
  styleUrls: ['./doctor-appointment-modal.component.css']
})
export class DoctorAppointmentModalComponent implements OnInit {
  sampleForm = new FormGroup({
    startDate: new FormControl(null, Validators.required),
    startTime: new FormControl(null, Validators.required),
    medicId: new FormControl(null, Validators.required),
    medicName: new FormControl(null, Validators.required),
    medService: new FormControl(null, Validators.required),
    medLocation: new FormControl(null, Validators.required),
    pacientName: new FormControl(null, Validators.required),
    pacientId: new FormControl(null, Validators.required),
    pacientAnimal: new FormControl(null, Validators.required),
  });
  public medicServices!: Observable<any>;
  public formTitle: string = '';
  public patientName: string = '';
  public users!: Observable<any>;
  public animals!: AnimalUtilInfo[];
  public doctorAppointment!: DoctorsAppointmentDTO;
  public appointmentFormPlaceHolder: any;
  public patientSelected!: boolean;
  public focusedPatient!: boolean;
  public doctorId: string = '';
  @ViewChild('patientList') patientList: any;
  @ViewChild('inputPatientName') inputPatientName: any;
  @ViewChild('animalList') animalList: any;

  constructor(
    private doctorService: DoctorService,
    private servicesService: DoctorServicesService,
    // private activeModal: NgbActiveModal,
    private doctorAppointmentService: DoctorAppointmentsService,
    private appointmentFormService: DoctorAppointmentFormService,
    private dateUtilsService: DateUtilsService
  ) {}

  ngOnInit(): void {
    this.appointmentFormPlaceHolder = APPOINTMENTFORM_DATA;
    this.formTitle = APPOINTMENTFORM_DATA.title;
    this.patientName = '';
    this.focusedPatient = false;
    this.doctorId = this.doctorService.getLoggedInDoctorId();
  }

  ngAfterViewInit(): void {
    this.animalList.nativeElement.classList.add('hidden');

    this.doctorService
      .getDoctorById(this.doctorId)
      .pipe(take(1))
      .subscribe((medic: DoctorDTO) => {
        this.sampleForm.patchValue({
          medicName: medic.doctorName,
          medLocation: medic.location,
          medicId: this.doctorId,
        });
      });

    this.medicServices = this.servicesService.getDoctorServices(this.doctorId);
  }

  onSubmit(): void {
    const newAnimalInfo = new AnimalUtilInfo()
      .setName(this.sampleForm.value.patientAnimal.animalName)
      .setUid(this.sampleForm.value.patientAnimal.animalId);

    const newDoctorAppointment = new DoctorsAppointmentDTO()
      .setUserName(this.sampleForm.value.patientName)
      .setUserId(this.sampleForm.value.patientId)
      .setServices(this.sampleForm.value.medService)
      .setDateTime(
        this.dateUtilsService.formatDateAndTime(
          this.sampleForm.value.startDate,
          this.sampleForm.value.startTime
        )
      )
      .setAnimal(newAnimalInfo)
      .setLocation(this.sampleForm.value.medLocation);

    if (!this.sampleForm.invalid) {
      this.doctorAppointmentService.createAppointment(
        [newDoctorAppointment],
        this.sampleForm.value.medicId
      );
    }

    // this.activeModal.close();
  }

  onCancelForm(): void {
    // this.activeModal.close();
  }

  filterPatients(searchText: string): void {
    this.users = this.appointmentFormService.filterPatients(searchText, this.patientName);
  }

  onSelectPatient(selectedPatient: UserDTO | any): void {
    this.focusedPatient = false;
    this.patientList.nativeElement.classList.add('hidden');
    this.sampleForm.patchValue({
      patientName: selectedPatient['name'],
      patientId: selectedPatient['id'],
    });
    this.animals = selectedPatient['animals'];
    this.animalList.nativeElement.classList.remove('hidden');
  }

  onFocusPatient(): void {
    this.focusedPatient = true;
    if (this.patientList.nativeElement.classList.contains('hidden')) {
      this.patientList.nativeElement.classList.remove('hidden');
    }
    this.animalList.nativeElement.classList.add('hidden');
  }

}

