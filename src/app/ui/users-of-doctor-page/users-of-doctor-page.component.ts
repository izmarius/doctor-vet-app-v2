import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersOfDoctorService} from "../../services/users-of-doctor/users-of-doctor.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {
  MODALS_DATA,
  QUICK_APP_PERIOD,
  UI_ALERTS_CLASSES,
  UI_USERS_OF_DOCTOR_MSGS,
  USER_ANIMAL_DIALOG, USERS_DOCTOR_PAGE_CONST,
  USERS_DOCTORS
} from "../../shared-data/Constants";
import {IUsersDoctors} from "../../services/users-of-doctor/users-doctors-interface";
import {UserService} from "../user-profile/services/user.service";
import {AnimalService} from "../services/animal.service";
import {CreateUserDialogComponent} from "../create-user-dialog/create-user-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {UsersDoctorsListService} from "../../services/usersDoctorsObservableService/usersDoctorsListService";
import {Subscription} from "rxjs";
import {CreateUserWithoutAccountDialogComponent} from "../create-user-without-account-dialog/create-user-without-account-dialog.component";

@Component({
  selector: 'app-users-of-doctor-page',
  templateUrl: './users-of-doctor-page.component.html',
  styleUrls: ['./users-of-doctor-page.component.scss']
})
export class UsersOfDoctorPageComponent implements OnInit, OnDestroy {

  animalData!: any;
  animalLabels = USER_ANIMAL_DIALOG;
  animalMedicalHistory: any;
  diseasesTitle!: string;
  isAnimalDataFetched: boolean = false;
  isAnimalMedicalHistoryFetched: boolean = false;
  isUserDataFetched: boolean = false;
  listOfClients: any;
  listUsersOfDoctorsSubscription!: Subscription;
  recommendationTitle!: string;
  quickAppointmentPeriods = QUICK_APP_PERIOD;
  userData: any;

  constructor(private animalService: AnimalService,
              private dialog: MatDialog,
              private uiAlert: UiErrorInterceptorService,
              private usersOfDoctorsService: UsersOfDoctorService,
              private userService: UserService,
              private usersDoctorsListService: UsersDoctorsListService) {
  }

  ngOnInit(): void {
    const storedClients = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));
    if (storedClients) {
      // todo create a job to refresh the localstorage once per day
      this.listUsersOfDoctorsSubscription = this.usersDoctorsListService.usersDoctorsListObs$.subscribe((usersDoctorsList) => {
        if (!usersDoctorsList || (usersDoctorsList && usersDoctorsList.length === storedClients.length)) {
          this.listOfClients = this.getSidebarContent(storedClients);
          return;
        }
        this.listOfClients = [];
        this.listOfClients = this.getSidebarContent(usersDoctorsList);
      });
    } else {
      this.getAllUsersDoctors();
    }
  }

  ngOnDestroy() {
    this.listUsersOfDoctorsSubscription.unsubscribe();
  }

  getAllUsersDoctors() {
    this.usersOfDoctorsService.getAllUsersOfDoctor()
      .subscribe((listOfUsers) => {
        if (listOfUsers.length > 0) {
          this.listOfClients = this.getSidebarContent(listOfUsers);
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
    sidebarContentUserWithAccount.title = USERS_DOCTOR_PAGE_CONST.CLIENT_WITH_ACCOUNT.title;
    sidebarContentUserWithAccount.buttonText = USERS_DOCTOR_PAGE_CONST.CLIENT_WITH_ACCOUNT.buttonText;
    sidebarContentUserWithoutAccount.title = USERS_DOCTOR_PAGE_CONST.CLIENT_WITHOUT_ACCOUNT.title;
    sidebarContentUserWithoutAccount.buttonText = USERS_DOCTOR_PAGE_CONST.CLIENT_WITHOUT_ACCOUNT.buttonText;
    sidebarContentUserWithoutAccount.list = this.getSidebarComponentLinks(usersWithoutAccount);

    return [sidebarContentUserWithAccount, sidebarContentUserWithoutAccount];
  }

  getSidebarComponentLinks(list: IUsersDoctors[]): any {
    const sidebarContentList: any = []
    list.forEach((userDoctor) => {
      const link = {
        name: userDoctor.clientName,
        id: userDoctor.clientId,
        userDoctor
      }
      sidebarContentList.push(link);
    });
    return sidebarContentList;
  }

  getUserData(link: any) {
    if (link && link.id) {
      this.userService.getUserDataById(link.id).subscribe((res) => {
        this.userData = {};
        this.animalData = {};
        this.userData = res;
        this.isAnimalDataFetched = false;
        this.isAnimalMedicalHistoryFetched = false;
        this.isUserDataFetched = true;
      }, error => {
        console.error('ERROR while fetching user data: ', JSON.stringify(error));
        this.uiAlert.setUiError({
          class: UI_ALERTS_CLASSES.ERROR,
          message: UI_USERS_OF_DOCTOR_MSGS.ERROR_GETTING_USERS_DATA
        })
      });
    } else {
      this.userData = {};
      this.animalData = {};
      this.userData.phone = link.userDoctor.clientPhone
      this.userData.name = link.userDoctor.clientName;
      this.isUserDataFetched = true;
      this.isAnimalDataFetched = false;
      this.isAnimalMedicalHistoryFetched = false;
      console.log(link.userDoctor);
    }
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

  openAddAppointmentDialog(userData: any) {

  }

  addRecurrentAppointment(period: string) {

  }

  openModalToAddNewUser(clientTitle: string) {
    //todo refactor here - is to ugly
    if (clientTitle.split(" ")[1] === USERS_DOCTOR_PAGE_CONST.CLIENT_WITH_ACC_SEPARATOR) {
      this.openCreateUserDialog();
    } else if (clientTitle.split(" ")[1] === USERS_DOCTOR_PAGE_CONST.CLIENT_WITHOUT_ACC_SEPARATOR) {
      this.openCreateUserWithoutAccountDialog();
    }
  }

  openCreateUserDialog(): void {
    this.dialog.open(CreateUserDialogComponent, {
      minWidth: '20%',
      minHeight: '10rem',
      panelClass: MODALS_DATA.DOCTOR_APP_MODAL,
    });
  }

  openCreateUserWithoutAccountDialog(): void {
    this.dialog.open(CreateUserWithoutAccountDialogComponent, {
      minWidth: '20%',
      minHeight: '10rem',
      panelClass: MODALS_DATA.DOCTOR_APP_MODAL,
    });
  }
}
