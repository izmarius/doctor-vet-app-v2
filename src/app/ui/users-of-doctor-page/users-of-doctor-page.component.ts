import {Component, OnInit} from '@angular/core';
import {UsersOfDoctorService} from "../../services/users-of-doctor/users-of-doctor.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {
  UI_ALERTS_CLASSES,
  UI_USERS_OF_DOCTOR_MSGS,
  USER_ANIMAL_DIALOG,
  USERS_DOCTORS
} from "../../shared-data/Constants";
import {IUsersDoctors} from "../../services/users-of-doctor/users-doctors-interface";
import {UserService} from "../user-profile/services/user.service";
import {AnimalService} from "../services/animal.service";

@Component({
  selector: 'app-users-of-doctor-page',
  templateUrl: './users-of-doctor-page.component.html',
  styleUrls: ['./users-of-doctor-page.component.scss']
})
export class UsersOfDoctorPageComponent implements OnInit {

  listOfClients: any;
  userData: any;
  animalData!: any;
  animalMedicalHistory: any;
  isUserDataFetched: boolean = false;
  isAnimalDataFetched: boolean = false;
  isAnimalMedicalHistoryFetched: boolean = false;
  diseasesTitle!: string;
  recommendationTitle!: string;

  constructor(private usersOfDoctorsService: UsersOfDoctorService,
              private uiAlert: UiErrorInterceptorService,
              private userService: UserService,
              private animalService: AnimalService) {
  }

  ngOnInit(): void {
    const storedClients = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));

    if (storedClients) {
      this.listOfClients = this.getSidebarContent(storedClients);
    } else {
      this.usersOfDoctorsService.getAllUsersOfDoctor()
        .subscribe((listOfUsers) => {
          if (listOfUsers.length > 0) {
            this.listOfClients = this.getSidebarContent(listOfUsers);
            console.log(this.listOfClients);
            localStorage.removeItem(USERS_DOCTORS);
            localStorage.setItem(USERS_DOCTORS, JSON.stringify(listOfUsers));
          }
        }, (error => {
          this.uiAlert.setUiError({
            class: UI_ALERTS_CLASSES.ERROR,
            message: UI_USERS_OF_DOCTOR_MSGS.ERROR_GETTING_USERS_DOCTORS
          });
          console.error(JSON.stringify(error));
        }))
    }
  }

  getSidebarContent(listOfUsers: IUsersDoctors[]): any {
    let usersWithAccount: IUsersDoctors[] = [];
    let usersWithoutAccount: IUsersDoctors[] = [];
    let sidebarContentUserWithAccount: any = {};
    let sidebarContentUserWithoutAccount: any = {};

    listOfUsers.forEach((userDoctor) => {
      if (userDoctor.isClientRegisteredInApp) {
        usersWithAccount.push(userDoctor);
      } else {
        usersWithoutAccount.push(userDoctor);
      }
    });
    sidebarContentUserWithAccount.title = 'Clienti cu cont';
    sidebarContentUserWithoutAccount.title = 'Clienti fara cont';
    sidebarContentUserWithAccount.list = this.getSidebarComponentLinks(usersWithAccount);
    sidebarContentUserWithoutAccount.list = this.getSidebarComponentLinks(usersWithoutAccount);

    return [sidebarContentUserWithAccount, sidebarContentUserWithoutAccount];
  }

  getSidebarComponentLinks(list: IUsersDoctors[]): any {
    const sidebarContentList: any = []
    list.forEach((userDoctor) => {
      const link = {
        name: userDoctor.clientName,
        id: userDoctor.clientId,
      }
      sidebarContentList.push(link);
    });
    return sidebarContentList;
  }

  getUserData(event: any) {
    this.userService.getUserDataById(event).subscribe((res) => {
      this.userData = res;
      this.isUserDataFetched = true;
    }, error => {
      console.error('ERROR while fetching user data: ', JSON.stringify(error));
      this.uiAlert.setUiError({
        class: UI_ALERTS_CLASSES.ERROR,
        message: UI_USERS_OF_DOCTOR_MSGS.ERROR_GETTING_USERS_DATA
      })
    });
  }

  getAnimalData(animalId: string) {
    this.animalService.getAnimalById(animalId, this.userData.id)
      .subscribe((res) => {
        this.animalData = res;
        this.isAnimalDataFetched = true;
        this.getAnimalMedicalHistory(animalId);
      }, error => {
        console.log("ERROR while fetching animal data: ", JSON.stringify(error));
        this.uiAlert.setUiError({
          class: UI_ALERTS_CLASSES.ERROR,
          message: UI_USERS_OF_DOCTOR_MSGS.ERROR_GETTING_USERS_DATA
        })
      })
  }

  getAnimalMedicalHistory(animalId: string) {
    this.animalService.getAnimalsMedicalHistoryDocs(animalId, this.userData.id)
      .subscribe((medicalHistoryCollection) => {
        this.isAnimalMedicalHistoryFetched = true;
        if (medicalHistoryCollection.docs && medicalHistoryCollection.docs.length === 0) {
          return;
        }
        medicalHistoryCollection.docs.forEach((medicalHistory: any) => {
          this.animalMedicalHistory = medicalHistory.data();
          this.diseasesTitle = USER_ANIMAL_DIALOG.animalDiseases;
          this.recommendationTitle = USER_ANIMAL_DIALOG.medicalHistory;
          console.log(medicalHistory.data());
        });
      }, error => {
        console.log("ERROR while fetching animal medical history: ", JSON.stringify(error));
        this.uiAlert.setUiError({
          class: UI_ALERTS_CLASSES.ERROR,
          message: UI_USERS_OF_DOCTOR_MSGS.ERROR_GETTING_ANIMAL_MEDICAL_HISTORY
        });
      });
  }
}
