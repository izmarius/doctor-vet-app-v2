import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnimalService} from "../services/animal.service";
import {
  APPOINTMENTFORM_DATA,
  DIALOG_UI_ERRORS,
  USER_ANIMAL_DIALOG,
  USER_LOCALSTORAGE
} from "../../shared-data/Constants";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DoctorAppointmentModalComponent} from "../doctor-appointment-modal/doctor-appointment-modal.component";
import {take} from "rxjs/operators";
import {FirestoreService} from "../../data/http/firestore.service";
import {DoctorsAppointmentDTO} from "../dto/doctor-appointments-dto";
import {Subscription} from "rxjs";
import {DoctorAppointmentsService} from "../services/doctor-appointments.service";
import {AnimalAppointmentService} from "../../services/animal-appointment/animal-appointment.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {DoctorService} from "../../services/doctor/doctor.service";

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
              private dialog: MatDialog,
              public dialogRef: MatDialogRef<UserAnimalInfoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private firestoreService: FirestoreService,
              private doctorAppointmentsService: DoctorAppointmentsService,
              private animalAppointment: AnimalAppointmentService,
              private uiAlertService: UiErrorInterceptorService,
              private doctorService: DoctorService,
              private uiAlertInterceptor: UiErrorInterceptorService
  ) {
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
        this.doctorAppointmentsService.cancelAppointment(this.userAnimalData.appointment, this.doctor, this.dialog);
      }
    });
  }

  removeAppointmentFromAppointmentMap() {
    const date = this.userAnimalData.appointment.dateTime.split('-')[0].trim();
    this.doctor.appointmentsMap[date].forEach((interval: any, index: number) => {
      if(interval.startTimestamp === this.userAnimalData.appointment.timestamp) {
        this.doctor.appointmentsMap[date].splice(index, 1);
        return;
      }
    });
    if(this.doctor.appointmentsMap[date].length === 0) {
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

    if(this.areAppointmentsOverlapping(appointmentDate)) {
      return;
    }
    let appointment = Object.create(this.userAnimalData.appointment);
    appointment.timestamp = appointmentDate.getTime();
    const localeDate = appointmentDate.toLocaleDateString();
    const dateTime = appointment.dateTime.split(' ');
    appointment.dateTime = localeDate + ' ' + dateTime[1] + ' ' + dateTime[2];

    // save new appointment to animal and to doctor
    const doctorAppointmentId = this.firestoreService.getNewFirestoreId();
    const animalAppointmentId = this.firestoreService.getNewFirestoreId();
    const newDoctorAppointment = this.getDoctorAppointment(animalAppointmentId, appointment);
    const newAnimalAppointment = this.getAnimalAppointmentPayload(doctorAppointmentId, animalAppointmentId, appointment);

    // todo update appointment date

    Promise.all([
      this.doctorService.updateDoctorInfo({appointmentsMap: this.doctor.appointmentsMap}, this.doctor.id),
      this.doctorAppointmentsService.createAppointment(newDoctorAppointment, this.doctor.id, doctorAppointmentId),
      this.animalAppointment.saveAnimalAppointment(newAnimalAppointment, appointment.userId, animalAppointmentId)
    ]).then(() => {
      localStorage.removeItem(USER_LOCALSTORAGE);
      localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(this.doctor));
      this.uiAlertService.setUiError({
        message: APPOINTMENTFORM_DATA.successAppointment,
        class: 'snackbar-success'
      });
    }).catch((error: any) => {
      this.uiAlertService.setUiError({message: error.message, class: 'snackbar-error'});
      console.log('Error: ', error);
    });
  }

  areAppointmentsOverlapping(date: Date): boolean {
    const startTimestamp = date.getTime()
    const endTimestamp = date.getTime() + (this.doctor.appointmentInterval * 60000);

    const appointmentDate = date.toLocaleDateString();
    if(!this.doctor.appointmentsMap[appointmentDate]) {
      this.doctor.appointmentsMap[appointmentDate] = [];
      this.doctor.appointmentsMap[appointmentDate].push({startTimestamp, endTimestamp});
      return false;
    }

    let overlappingAppointment = this.doctor.appointmentsMap[appointmentDate].find((interval: any) => {
      return startTimestamp >= interval.startTimestamp && startTimestamp <= interval.endTimestamp;
    });

    if(overlappingAppointment) {
      this.uiAlertInterceptor.setUiError({
        message: 'O programare exista deja in acest interval orar.',
        class: 'snackbar-error'
      });
      return true;
    }

    this.doctor.appointmentsMap[appointmentDate].push({startTimestamp, endTimestamp});
    return false;
  }

  getDoctorAppointment(animalAppointmentId: string, appointmentInfo: any) {
    return new DoctorsAppointmentDTO()
      .setUserName(appointmentInfo.userName)
      .setUserId(appointmentInfo.userId)
      .setServices(appointmentInfo.services)
      .setDateTime(
        appointmentInfo.dateTime
      )
      .setAnimal(appointmentInfo.animalData)
      .setLocation(appointmentInfo.location)
      .setUserEmail(appointmentInfo.userEmail)
      .setPhone(appointmentInfo.phone)
      .setIsAppointmentFinished(false)
      .setIsConfirmedByDoctor(true)
      .setAnimalAppointmentId(animalAppointmentId)
      .setTimestamp(appointmentInfo.timestamp);
  }

  getAnimalAppointmentPayload(doctorAppointmentId: string, animalAppointmentId: string, appointmentInfo: any): any {
    let userPhoneNumber = '+4';
    if (appointmentInfo.phone.length === 10) {
      // this change is made for sms notification!! - also validate on cloud functions to make sure that the phone respects this prefix
      userPhoneNumber += appointmentInfo.phone;
    }
    return {
      animalName: appointmentInfo.animalData.name,
      isCanceled: false,
      dateTime: appointmentInfo.dateTime,
      doctorId: this.doctor.id,
      doctorName: this.doctor.doctorName,
      location: this.doctor.location,
      service: appointmentInfo.services,
      doctorAppointmentId: doctorAppointmentId,
      timestamp: appointmentInfo.timestamp,
      email: appointmentInfo.userEmail,
      phone: userPhoneNumber,
      userId: appointmentInfo.userId,
      id: animalAppointmentId
    }
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

  //FOR MULTIPLE ANIMALS

  // getAndSetAnimalData(event: any, animalId: string): void {
  //   // todo validation here - if same id => don't go further
  //   // if(animalId !== this.userAnimalData) {
  //   //
  //   // }
  //   this.animalService.getAnimalDataAndMedicalHistoryByAnimalId(animalId, this.data.userId).subscribe((res) => {
  //     this.userAnimalData = res;
  //     this.userAnimalData.appointment = this.data.appointment;
  //     this.userAnimalData.appointmentId = this.data.appointmentId;
  //     this.userAnimalData.animalMedicalHistory = res.animalMedicalHistory;
  //     this.userAnimalData.animalMedicalHistory.diseases = !res.animalMedicalHistory.diseases? [] : res.animalMedicalHistory.diseases;
  //     this.userAnimalData.animalMedicalHistory.recommendations = !res.animalMedicalHistory.recommendations? [] : res.animalMedicalHistory.recommendations;
  //     // this.toggleActiveClass(event);
  //   });
  // }

  //
  // setSelectedAnimalActive(animalId: string): void {
  //   for (const elem of this.ANIMAL_PARENT_ELEM.nativeElement.children) {
  //     if (elem.id === animalId) {
  //       this.selectedLink = elem;
  //       this.isActiveLink = true;
  //       break;
  //     }
  //   }
  // }

  // toggleActiveClass(event: any): void {
  //   for (const elem of this.ANIMAL_PARENT_ELEM.nativeElement.children) {
  //     if (elem.id === event.target.id && this.selectedLink.id !== event.target.id) {
  //       this.selectedLink = elem;
  //       this.isActiveLink = true;
  //       return;
  //     }
  //   }
  // }

}

