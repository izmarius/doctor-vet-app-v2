import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserService} from "../user-profile/services/user.service";
import {MY_ANIMALS, UI_ALERTS_CLASSES, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {AnimalService} from "../services/animal.service";
import {take} from "rxjs/operators";
import {IAnimalDoc} from "../dto/animal-util-info";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {LoaderService} from "../../services/loader/loader.service";

@Component({
  selector: 'app-my-animals',
  templateUrl: './my-animals.component.html',
  styleUrls: ['./my-animals.component.scss']
})
export class MyAnimalsComponent implements OnInit {
  isAnimalFormShown = false;
  isNoMedicalHistoryDisplayed = false;
  isMedicalHistoryShown = false;
  medicalHistory: any;
  selectedAnimalId: any;
  user: any;

  constructor(private userService: UserService,
              private animalsService: AnimalService,
              private uiAlert: UiErrorInterceptorService,
              private loaderService: LoaderService) {
  }

  ngOnInit(): void {
    this.user = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    if (this.user && this.user.animals && this.user.animals.length > 0) {
      this.getAnimalDetails(this.user.animals[0].animalId);
    }
  }

  getAnimalDetails(animalId: string, event = null) {
    this.isAnimalFormShown = false;
    // todo add to localStorage?
    this.animalsService.getAnimalsMedicalHistoryDocs(animalId, this.user.id)
      .pipe(take(1))
      .subscribe((medicalHistoryCollection) => {
        this.toggleActiveAnimal(animalId, event);
        this.selectedAnimalId = animalId;
        if (medicalHistoryCollection.docs && medicalHistoryCollection.docs.length === 0) {
          this.isNoMedicalHistoryDisplayed = true;
          this.isMedicalHistoryShown = false;
          return;
        }
        medicalHistoryCollection.docs.forEach((medicalHistory: any) => {
          this.medicalHistory = medicalHistory.data();
          this.isMedicalHistoryShown = true;
          this.isNoMedicalHistoryDisplayed = false;
        });
      }, error => {
        console.error(error);
        this.uiAlert.setUiError({
          message: MY_ANIMALS.ERROR_FETCHING_MEDICAL_HISTORY,
          class: UI_ALERTS_CLASSES.ERROR
        })
      });
  }

  toggleActiveAnimal(animalId: string, event: any = null): void {
    // todo : create a service with toggle links functionality?
    if (!this.selectedAnimalId) {
      return;
    }
    if (event) {
      const currentSelectedElement = document.getElementById(this.selectedAnimalId);
      // @ts-ignore
      currentSelectedElement.classList.remove('link--active');
      // @ts-ignore
      event.classList.add('link--active');
    }
  }

  toggleShowAnimalForm() {
    this.isAnimalFormShown = !this.isAnimalFormShown;
    if (this.isAnimalFormShown) {
      this.isMedicalHistoryShown = false;
    }
  }

  saveNewAnimalByUser(animalPayload: IAnimalDoc): void {
    // todo : getALLUserOf Doctor and send Id to update - CREATE TASK TO REMOVE ANIMALS FROM USER OF DOCTORS? OR SAVE DOCTORiD IN A LIST!

    this.userService.updateAllUserDoctorAndUserWithAnimalData(animalPayload, this.user)
      .pipe(take(1))
      .subscribe(() => {
        this.loaderService.hide();
        this.userService.setUserDataToLocalStorage(this.user);
      });
  }
}
