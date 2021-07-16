import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {AnimalService} from "../doctor-appointments/services/animal.service";
import {IUserAnimalAndMedicalHistory} from "./dto/user-animal-medical-history-dto";
import {DIALOG_UI_ERRORS, USER_ANIMAL_DIALOG} from "../../shared-data/Constants";

@Component({
  selector: 'app-user-animal-info',
  templateUrl: './user-animal-info.component.html',
  styleUrls: ['./user-animal-info.component.scss']
})
export class UserAnimalInfoComponent implements OnInit {

  @ViewChild('animalsParent') private ANIMAL_PARENT_ELEM!: ElementRef;
  private USER_ANIMAL_SUB!: Subscription;

  public editedRecommendation: string = '';
  public isActiveLink!: boolean;
  public isAddDiseaseEnabled!: boolean;
  public isAddRecEnabled!: boolean;
  public newDisease: string = '';
  public newRecommendation: string = '';
  public selectedLink: any;
  public userAnimalData!: IUserAnimalAndMedicalHistory;
  public userAnimalDialog: any;
  public userAnimalDialogErrorTxt: any;
  @Input() data: any;
  @Output() closeAppointmentSectionEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private animalService: AnimalService) {
  }


  ngOnInit(): void {
    this.userAnimalDialog = USER_ANIMAL_DIALOG;
    this.userAnimalDialogErrorTxt = DIALOG_UI_ERRORS;
    this.USER_ANIMAL_SUB = this.data.userAnimalDataObs.subscribe((userAnimalData: any) => {
      this.userAnimalData = userAnimalData;
      setTimeout(() => this.setSelectedAnimalActive(userAnimalData.animalData.id), 0);
    });
  }

  ngOnDestroy(): void {
    this.USER_ANIMAL_SUB?.unsubscribe();
  }

  addDisease(): void {
    if (!!!this.newDisease) {
      return;
    }
    this.userAnimalData.animalMedicalHistory.diseases.push(this.newDisease);
    this.updateMedicalHistory(this.data.userId, this.selectedLink.id, {diseases: this.userAnimalData.animalMedicalHistory.diseases});
    this.hideDiseaseInput();
  }

  showDiseaseInput(): void {
    this.isAddDiseaseEnabled = true;
  }

  addNewAppointment(): void {
    // todo: add appointment and take animal id from selectedLink
  }

  addRecommendation(): void {
    if (!!!this.newRecommendation) {
      return;
    }
    this.userAnimalData.animalMedicalHistory.recommendations.push(this.newRecommendation);
    this.updateMedicalHistory(this.data.userId, this.selectedLink.id, {recommendations: this.userAnimalData.animalMedicalHistory.recommendations});
    this.hideRecommendationInput();
  }

  closeAppointmentDetails(): void {
    this.closeAppointmentSectionEmitter.emit();
  }

  showRecommendationInput(): void {
    this.isAddRecEnabled = true;
  }

  getAndSetAnimalData(event: any, animalId: string): void {
    this.animalService.getAnimalDataAndMedicalHistoryByAnimalId(animalId, this.data.userId).subscribe((res) => {
      this.userAnimalData = res;
      this.toggleActiveClass(event);
    });
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
    if(indexOfDisease === -1) {
      return;
    }
    this.userAnimalData.animalMedicalHistory.diseases[indexOfDisease] = this.newDisease.trim();
    this.updateMedicalHistory(this.data.userId, this.selectedLink.id, {diseases: this.userAnimalData.animalMedicalHistory.diseases});
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
    if(indexOfRecommendation === -1) {
      return;
    }
    this.userAnimalData.animalMedicalHistory.recommendations[indexOfRecommendation] = this.newRecommendation.trim();
    this.updateMedicalHistory(this.data.userId, this.selectedLink.id, {recommendations: this.userAnimalData.animalMedicalHistory.recommendations});
    this.toggleEditInputAndListItem(false, editIcon, editInput, errorElem, checkIcon, closeInputIcon, recItem);
  }

  resetErrorMessage(errorElem: HTMLLIElement): void {
    if (errorElem.innerText) {
      errorElem.classList.add('hide');
      errorElem.innerText = '';
    }
  }

  setSelectedAnimalActive(animalId: string): void {
    for (const elem of this.ANIMAL_PARENT_ELEM.nativeElement.children) {
      if (elem.id === animalId) {
        this.selectedLink = elem;
        this.isActiveLink = true;
      }
    }
  }

  toggleActiveClass(event: any): void {
    for (const elem of this.ANIMAL_PARENT_ELEM.nativeElement.children) {
      if (elem.id === event.target.id && this.selectedLink.id !== event.target.id) {
        this.selectedLink = elem;
        this.isActiveLink = true;
        return;
      }
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
    this.updateMedicalHistory(this.data.userId, this.selectedLink.id, {diseases: this.userAnimalData.animalMedicalHistory.diseases});
  }

  deleteFromRecommendation(data: string): void {
    const indexOfRecommendation = this.userAnimalData.animalMedicalHistory.recommendations.indexOf(data);
    this.userAnimalData.animalMedicalHistory.recommendations.splice(indexOfRecommendation, 1);
    this.updateMedicalHistory(this.data.userId, this.selectedLink.id, {recommendations: this.userAnimalData.animalMedicalHistory.recommendations});
  }
}

