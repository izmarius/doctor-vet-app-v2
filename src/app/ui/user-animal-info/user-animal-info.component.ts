import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnimalService} from "../services/animal.service";
import {
  DIALOG_UI_ERRORS, MODALS_DATA, QUICK_APP_PERIOD,
  USER_ANIMAL_DIALOG,
  USER_LOCALSTORAGE
} from "../../shared-data/Constants";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FirestoreService} from "../../data/http/firestore.service";
import {Subscription} from "rxjs";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {AppointmentsService} from "../../services/appointments/appointments.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-user-animal-info',
  templateUrl: './user-animal-info.component.html',
  styleUrls: ['./user-animal-info.component.scss']
})
export class UserAnimalInfoComponent implements OnInit, OnDestroy {

  @ViewChild('animalsParent') private ANIMAL_PARENT_ELEM!: ElementRef;
  public doctor: any;
  private HIDE_CLASS = 'hide';
  public isAddDiseaseEnabled!: boolean;
  public isAddRecEnabled!: boolean;
  public newDisease: string = '';
  public newRecommendation: string = '';
  quickAppointmentPeriods = QUICK_APP_PERIOD;
  public userAnimalData!: any;
  public userAnimalDialog: any;
  public userAnimalDialogErrorTxt: any;
  public userAnimalDataSub!: Subscription;

  constructor(private animalService: AnimalService,
              private appointmentService: AppointmentsService,
              private dialog: MatDialog,
              public dialogRef: MatDialogRef<UserAnimalInfoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private firestoreService: FirestoreService) {
  }

  ngOnInit(): void {
    this.userAnimalDialog = USER_ANIMAL_DIALOG;
    this.userAnimalDialogErrorTxt = DIALOG_UI_ERRORS;
    this.doctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    this.userAnimalData = this.data.userAnimalData;
  }

  ngOnDestroy() {
    this.userAnimalDataSub?.unsubscribe();
  }

  // todo : daca au depasit orele de munca? sau programarea a expirat?
  openConfirmationModalModal(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: MODALS_DATA.CONFIRMATION_MODAL
    });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(isAppointmentCanceled => {
        this.dialogRef.close(isAppointmentCanceled);
      });
  }

  addRecurrentAppointment(period: string) {
    this.appointmentService.addRecurrentAppointment(period, this.doctor, this.data)
    this.appointmentService.addRecurrentAppointment(period, this.doctor, this.data)
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

  addRecommendation(): void {
    // TODO when is this happening? how to delete it?
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
      errorElem.classList.remove(this.HIDE_CLASS);
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
      errorElem.classList.remove(this.HIDE_CLASS);
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
      errorElem.classList.add(this.HIDE_CLASS);
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
      diseaseItem.classList.add(this.HIDE_CLASS);
      editIcon.classList.add(this.HIDE_CLASS);
      checkIcon.classList.remove(this.HIDE_CLASS);
      editInput.classList.remove(this.HIDE_CLASS);
      closeInputIcon.classList.remove(this.HIDE_CLASS);
    } else {
      editInput.value = '';
      diseaseItem.classList.remove(this.HIDE_CLASS);
      editIcon.classList.remove(this.HIDE_CLASS);
      errorText.classList.add(this.HIDE_CLASS);
      checkIcon.classList.add(this.HIDE_CLASS);
      editInput.classList.add(this.HIDE_CLASS);
      closeInputIcon.classList.add(this.HIDE_CLASS);
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

