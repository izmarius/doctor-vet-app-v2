import {Component, OnInit} from '@angular/core';
import {UserService} from "../user-profile/services/user.service";
import {USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {AnimalService} from "../services/animal.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-my-animals',
  templateUrl: './my-animals.component.html',
  styleUrls: ['./my-animals.component.scss']
})
export class MyAnimalsComponent implements OnInit {
  isAnimalFormShown = false;
  isNoMedicalHistoryDisplayed = false;
  isMedicalHistoryShown = false;
  user: any;
  medicalHistory: any;

  constructor(private userService: UserService,
              private animalsService: AnimalService) {
  }

  ngOnInit(): void {
    this.user = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    if (this.user && this.user.animals && this.user.animals.length > 0) {
      this.getAnimalDetails(this.user.animals[0].animalId);
    }
  }

  getAnimalDetails(animalId: string) {
    this.isAnimalFormShown = false;
    this.animalsService.getAnimalsMedicalHistoryDocs(animalId, this.user.id)
      .pipe(take(1))
      .subscribe((medicalHistoryCollection) => {
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
      });
  }

  toggleShowAnimalForm() {
    this.isAnimalFormShown = !this.isAnimalFormShown;
    if (this.isAnimalFormShown) {
      this.isMedicalHistoryShown = false;
    }
  }

  saveNewAnimal(animalPayload: any): void {
    // todo : getUserOf Doctor and send Id to update
    this.userService.updateUserWithAnimalData(animalPayload, this.user).then(() => {
      this.userService.setUserDataToLocalStorage(this.user);
    });
  }
}
