import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnimalService} from "../services/animal.service";
import {
  APPOINTMENTFORM_DATA,
  DIALOG_UI_ERRORS, UI_ALERTS_CLASSES,
  USER_ANIMAL_DIALOG,
  USER_LOCALSTORAGE
} from "../../shared-data/Constants";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DoctorAppointmentModalComponent} from "../doctor-appointment-modal/doctor-appointment-modal.component";
import {take} from "rxjs/operators";
import {FirestoreService} from "../../data/http/firestore.service";
import {Subscription} from "rxjs";
import {DoctorAppointmentsService} from "../services/doctor-appointments.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {DoctorService} from "../../services/doctor/doctor.service";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {AppointmentsService} from "../../services/appointments/appointments.service";

@Component({
  selector: 'app-user-animal-info',
  templateUrl: './user-animal-info.component.html',
  styleUrls: ['./user-animal-info.component.scss']
})
export class UserAnimalInfoComponent implements OnInit, OnDestroy {

  @ViewChild('animalsParent') private ANIMAL_PARENT_ELEM!: ElementRef;

  public isAddDiseaseEnabled!: boolean;
  public isAddRecEnabled!: boolean;
  public newDisease: string = '';
  public newRecommendation: string = '';
  public userAnimalData!: any;
  public doctor: any;
  public userAnimalDialog: any;
  public userAnimalDialogErrorTxt: any;
  public userAnimalDataSub!: Subscription;

  constructor(private animalService: AnimalService,
              private appointmentService: AppointmentsService,
              private dateUtils: DateUtilsService,
              private dialog: MatDialog,
              public dialogRef: MatDialogRef<UserAnimalInfoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private doctorAppointmentsService: DoctorAppointmentsService,
              private doctorService: DoctorService,
              private firestoreService: FirestoreService,
              private uiAlertService: UiErrorInterceptorService) {
  }

  ngOnInit(): void {
    this.userAnimalDialog = USER_ANIMAL_DIALOG;
    this.userAnimalDialogErrorTxt = DIALOG_UI_ERRORS;
    this.doctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.userAnimalDataSub = this.data?.userAnimalDataObs
      .pipe(take(1))
      .subscribe((userAnimalData: any) => {
        // todo refactor and get initial data only from one place!!!! - spaghetti
        this.userAnimalData = userAnimalData;
        this.userAnimalData.appointment = this.data.appointment;
        this.userAnimalData.appointmentId = this.data.appointmentId;
        this.userAnimalData.animalMedicalHistory = userAnimalData.animalMedicalHistory;
        this.userAnimalData.animalMedicalHistory.diseases = !userAnimalData.animalMedicalHistory.diseases ? [] : userAnimalData.animalMedicalHistory.diseases;
        this.userAnimalData.animalMedicalHistory.recommendations = !userAnimalData.animalMedicalHistory.recommendations ? [] : userAnimalData.animalMedicalHistory.recommendations;
      });
  }

  ngOnDestroy() {
    this.userAnimalDataSub?.unsubscribe();
  }

  // todo : daca au depasit orele de munca? sau programarea a expirat?
  openConfirmationModalModal(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirmation-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userAnimalData.appointment.id = this.userAnimalData.appointmentId;
        // how to handle the filing request - we will have corrupted data
        this.removeAppointmentFromAppointmentMap();
        this.appointmentService.cancelAppointmentByDoctor(this.userAnimalData.appointment, this.doctor, this.dialog);
      }
    });
  }

  removeAppointmentFromAppointmentMap() {
    const date = this.userAnimalData.appointment.dateTime.split('-')[0].trim();
    this.doctor.appointmentsMap[date].forEach((interval: any, index: number) => {
      if (interval.startTimestamp === this.userAnimalData.appointment.timestamp && interval.appointmentId === this.userAnimalData.appointment.id) {
        this.doctor.appointmentsMap[date].splice(index, 1);
        return;
      }
    });
    if (this.doctor.appointmentsMap[date].length === 0) {
      delete this.doctor.appointmentsMap[date];
    }
  }

  addRecurrentAppointment(period: string) {
    let appointmentDate = new Date(this.userAnimalData.appointment.timestamp);
    if (period === 'day') {
      appointmentDate.setDate(appointmentDate.getDate() + 1);
    } else if (period === 'week') {
      appointmentDate.setDate(appointmentDate.getDate() + 14);
    } else if (period === 'month') {
      appointmentDate.setMonth(appointmentDate.getMonth() + 1);
    } else if (period === 'year') {
      appointmentDate.setFullYear(appointmentDate.getFullYear() + 1);
    } else {
      // todo display error message
      return;
    }
    if (this.doctorAppointmentsService.isFreeDayForDoctor(this.doctor.schedule, appointmentDate)) {
      return;
    }
    const appointmentId = this.firestoreService.getNewFirestoreId();

    if (this.doctorAppointmentsService.areAppointmentsOverlapping(appointmentDate, this.doctor, appointmentId)) {
      return;
    }
    let appointment = Object.create(this.userAnimalData.appointment);
    appointment.timestamp = appointmentDate.getTime();
    const localeDate = this.dateUtils.getDateFormat(appointmentDate);
    const dateTime = appointment.dateTime.split(' ');
    appointment.dateTime = localeDate + ' ' + dateTime[1] + ' ' + dateTime[2];

    // save new appointment to animal and to doctor

    const appointmentDTO = this.appointmentService.getUserAnimalInfoAppointmentDTO(appointment, this.doctor, appointmentId);

    Promise.all([
      this.doctorService.updateDoctorInfo({appointmentsMap: this.doctor.appointmentsMap}, this.doctor.id),
      this.appointmentService.createAppointment(appointmentDTO),
    ]).then(() => {
      localStorage.removeItem(USER_LOCALSTORAGE);
      localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(this.doctor));
      this.uiAlertService.setUiError({
        message: APPOINTMENTFORM_DATA.successAppointment,
        class: UI_ALERTS_CLASSES.SUCCESS
      });
    }).catch((error: any) => {
      this.uiAlertService.setUiError({message: error.message, class: UI_ALERTS_CLASSES.ERROR});
      console.log('Error: ', error);
    });
  }

  addDisease(): void {
    if (!this.newDisease) {
      return;
    }
    this.userAnimalData.animalMedicalHistory.diseases.push(this.newDisease);
    if (!this.userAnimalData.medicalHistoryDocId) {
      this.userAnimalData.medicalHistoryDocId = this.firestoreService.getNewFirestoreId();
      this.createMedicalHistory(this.data.userId, this.userAnimalData.animalData.id, {diseases: this.userAnimalData.animalMedicalHistory.diseases});
    } else {
      this.updateMedicalHistory(this.data.userId, this.userAnimalData.animalData.id, {diseases: this.userAnimalData.animalMedicalHistory.diseases});
    }
    this.hideDiseaseInput();
  }

  showDiseaseInput(): void {
    this.isAddDiseaseEnabled = true;
  }

  addNewAppointment(): void {
    const dialogRef = this.dialog.open(DoctorAppointmentModalComponent, {
      height: '37.5rem',
      panelClass: 'doctor-appointment-dialog',
      data: null
    });


    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addRecommendation(): void {
    if (!this.newRecommendation) {
      return;
    }
    this.userAnimalData.animalMedicalHistory.recommendations.push(this.newRecommendation);
    if (!this.userAnimalData.medicalHistoryDocId) {
      this.userAnimalData.medicalHistoryDocId = this.firestoreService.getNewFirestoreId();
      this.createMedicalHistory(this.data.userId, this.userAnimalData.animalData.id, {recommendations: this.userAnimalData.animalMedicalHistory.recommendations})
    } else {
      this.updateMedicalHistory(this.data.userId, this.userAnimalData.animalData.id, {recommendations: this.userAnimalData.animalMedicalHistory.recommendations});
    }
    this.hideRecommendationInput();
  }

  closeAppointmentDetails(): void {
    this.dialogRef.close()
  }

  showRecommendationInput(): void {
    this.isAddRecEnabled = true;
  }

  hideDiseaseInput(): void {
    this.newDisease = '';
    this.isAddDiseaseEnabled = false;
  }

  hideRecommendationInput(): void {
    this.newRecommendation = '';
    this.isAddRecEnabled = false;
  }

  editDisease(editIcon: HTMLSpanElement,
              editInput: HTMLInputElement,
              errorElem: HTMLLIElement,
              checkIcon: HTMLSpanElement,
              closeInputIcon: HTMLSpanElement,
              diseaseItem: HTMLLIElement): void {
    if (!diseaseItem.innerText || !this.newDisease || diseaseItem.innerText === this.newDisease.trim()) {
      errorElem.classList.remove('hide');
      return;
    }
    this.resetErrorMessage(errorElem);
    const indexOfDisease = this.userAnimalData.animalMedicalHistory.diseases.indexOf(diseaseItem.innerText);
    if (indexOfDisease === -1) {
      return;
    }
    this.userAnimalData.animalMedicalHistory.diseases[indexOfDisease] = this.newDisease.trim();
    this.updateMedicalHistory(this.data.userId, this.userAnimalData.animalData.id, {diseases: this.userAnimalData.animalMedicalHistory.diseases});
    this.toggleEditInputAndListItem(false, editIcon, editInput, errorElem, checkIcon, closeInputIcon, diseaseItem);
  }

  editRecommendations(editIcon: HTMLSpanElement,
                      editInput: HTMLInputElement,
                      errorElem: HTMLLIElement,
                      checkIcon: HTMLSpanElement,
                      closeInputIcon: HTMLSpanElement,
                      recItem: HTMLLIElement): void {

    if (!recItem.innerText || !this.newRecommendation || recItem.innerText === this.newRecommendation.trim()) {
      errorElem.classList.remove('hide');
      return;
    }
    this.resetErrorMessage(errorElem);
    const indexOfRecommendation = this.userAnimalData.animalMedicalHistory.recommendations.indexOf(recItem.innerText);
    if (indexOfRecommendation === -1) {
      return;
    }
    this.userAnimalData.animalMedicalHistory.recommendations[indexOfRecommendation] = this.newRecommendation.trim();
    this.updateMedicalHistory(this.data.userId, this.userAnimalData.animalData.id, {recommendations: this.userAnimalData.animalMedicalHistory.recommendations});
    this.toggleEditInputAndListItem(false, editIcon, editInput, errorElem, checkIcon, closeInputIcon, recItem);
  }

  resetErrorMessage(errorElem: HTMLLIElement): void {
    if (errorElem.innerText) {
      errorElem.classList.add('hide');
      errorElem.innerText = '';
    }
  }

  toggleEditInputAndListItem(isInputDisplayed: boolean,
                             editIcon: HTMLSpanElement,
                             editInput: HTMLInputElement,
                             errorText: HTMLLIElement,
                             checkIcon: HTMLSpanElement,
                             closeInputIcon: HTMLSpanElement,
                             diseaseItem: HTMLLIElement): void {
    if (isInputDisplayed) {
      editInput.value = diseaseItem.innerText;
      diseaseItem.classList.add('hide');
      editIcon.classList.add('hide');
      checkIcon.classList.remove('hide');
      editInput.classList.remove('hide');
      closeInputIcon.classList.remove('hide');
    } else {
      // reset input value
      editInput.value = '';
      diseaseItem.classList.remove('hide');
      editIcon.classList.remove('hide');
      errorText.classList.add('hide');
      checkIcon.classList.add('hide');
      editInput.classList.add('hide');
      closeInputIcon.classList.add('hide');
    }
  }

  createMedicalHistory(userId: string, animalId: string, payload: any): void {
    const ANIMALS_COLLECTION = '/animals';
    const MEDICAL_HISTORY_COLLECTION = '/medical-history';
    const USER_COLLECTION = 'user/';
    const url = USER_COLLECTION + userId + ANIMALS_COLLECTION + '/' + animalId + MEDICAL_HISTORY_COLLECTION;
    this.animalService.createAnimalHistory(url, this.userAnimalData.medicalHistoryDocId, payload);
  }

  updateMedicalHistory(userId: string, animalId: string, payload: any): void {
    const ANIMALS_COLLECTION = '/animals';
    const MEDICAL_HISTORY_COLLECTION = '/medical-history';
    const USER_COLLECTION = 'user/';
    const url = USER_COLLECTION + userId + ANIMALS_COLLECTION + '/' + animalId + MEDICAL_HISTORY_COLLECTION;
    this.animalService.updateAnimalsSubCollections(url, this.userAnimalData.medicalHistoryDocId, payload);
  }

  deleteFromDiseases(data: string): void {
    const indexOfDisease = this.userAnimalData.animalMedicalHistory.diseases.indexOf(data);
    this.userAnimalData.animalMedicalHistory.diseases.splice(indexOfDisease, 1);
    this.updateMedicalHistory(this.data.userId, this.userAnimalData.animalData.id, {diseases: this.userAnimalData.animalMedicalHistory.diseases});
  }

  deleteFromRecommendation(data: string): void {
    const indexOfRecommendation = this.userAnimalData.animalMedicalHistory.recommendations.indexOf(data);
    this.userAnimalData.animalMedicalHistory.recommendations.splice(indexOfRecommendation, 1);
    this.updateMedicalHistory(this.data.userId, this.userAnimalData.animalData.id, {recommendations: this.userAnimalData.animalMedicalHistory.recommendations});
  }

}

