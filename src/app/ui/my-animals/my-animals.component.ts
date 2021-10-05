import {Component, OnInit} from '@angular/core';
import {UserService} from "../user-profile/services/user.service";
import {USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {AnimalService} from "../doctor-appointments/services/animal.service";

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
    setTimeout(() => {
      this.user = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
      if(this.user && this.user.animals && this.user.animals.length > 0) {
        this.getAnimalDetails(this.user.animals[0].animalId);
      }
    }, 600)
  }

  getAnimalDetails(animalId: string) {
    this.isAnimalFormShown = false;
    this.animalsService.getAnimalsMedicalHistoryDocs(animalId, this.user.id)
      .subscribe((medicalHistoryCollection) => {
        if(medicalHistoryCollection.docs && medicalHistoryCollection.docs.length === 0) {
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
    if(this.isAnimalFormShown) {
      this.isMedicalHistoryShown = false;
    }
  }

  saveNewAnimal(animalPayload: any): void {
    this.userService.updateUserWithAnimalData(animalPayload, this.user);
  }
}
