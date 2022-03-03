import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UsersOfDoctorService} from "../../services/users-of-doctor/users-of-doctor.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {
  ANIMAL_SERVICE_MESSAGES,
  MODALS_DATA,
  QUICK_APP_PERIOD,
  UI_ALERTS_CLASSES,
  UI_USERS_OF_DOCTOR_MSGS,
  USER_ANIMAL_DIALOG, USER_LOCALSTORAGE, USERS_DOCTOR_PAGE_CONST,
  USERS_DOCTORS
} from "../../shared-data/Constants";
import {IUsersDoctors} from "../../services/users-of-doctor/users-doctors-interface";
import {UserService} from "../user-profile/services/user.service";
import {AnimalService} from "../services/animal.service";
import {MatDialog} from "@angular/material/dialog";
import {UsersDoctorsListService} from "../../services/usersDoctorsObservableService/usersDoctorsListService";
import {CreateUserWithoutAccountDialogComponent} from "../create-user-without-account-dialog/create-user-without-account-dialog.component";
import {AppointmentsService} from "../../services/appointments/appointments.service";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";
import {DoctorAppointmentModalComponent} from "../doctor-appointment-modal/doctor-appointment-modal.component";
import {DoctorAppointmentWithoutUserModalComponent} from "../doctor-appointment-without-user-modal/doctor-appointment-without-user-modal.component";
import {IAnimalUserInfo} from "../dto/animal-util-info";

@Component({
  selector: 'app-users-of-doctor-page',
  templateUrl: './users-of-doctor-page.component.html',
  styleUrls: ['./users-of-doctor-page.component.scss']
})
export class UsersOfDoctorPageComponent implements OnInit, OnDestroy {

  animalData!: any;
  animalFormData: any;
  animalLabels = USER_ANIMAL_DIALOG;
  animalMedicalHistory: any;
  animalOfUserWithoutAccount: string = '';
  diseasesTitle!: string;
  doctor: any;
  isAddAnimalFormDisplayed: boolean = false;
  isAnimalDataFetched: boolean = false;
  isAnimalMedicalHistoryFetched: boolean = false;
  isEditAnimalDataClicked: boolean = false;
  isInitialLoadOfComponent: boolean = true;
  isSearchingByPhone: boolean = false;
  isUserDataFetched: boolean = false;
  listOfClients: any;
  nameOrPhoneToSearch: string = '';
  recommendationTitle!: string;
  searchTextPlaceholders: any;
  searchUserList: any[] = [];
  selectedUserOfDoctor: any;
  quickAppointmentPeriods = QUICK_APP_PERIOD;
  userData: any;
  usersOfDoctorsSub: Subscription = new Subscription();

  @ViewChild('searchedUserListElement') searchedUserListElement: any;

  constructor(private animalService: AnimalService,
              private appointmentService: AppointmentsService,
              private dateUtils: DateUtilsService,
              private dialog: MatDialog,
              private uiAlert: UiErrorInterceptorService,
              private usersOfDoctorsService: UsersOfDoctorService,
              private userService: UserService,
              private userListService: UsersDoctorsListService,
              private usersDoctorsListService: UsersDoctorsListService) {
  }

  ngOnInit(): void {
    this.searchTextPlaceholders = USERS_DOCTOR_PAGE_CONST;
    this.doctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE))
    this.setUsersOfDoctors();
  }

  ngOnDestroy() {
    this.usersOfDoctorsSub.unsubscribe();
  }

  addAnimalToUserWithoutAccount() {
    if (this.animalOfUserWithoutAccount) {
      const newAnimalsList = this.userData.animals.slice();
      newAnimalsList.push({animalName: this.animalOfUserWithoutAccount})
      this.usersOfDoctorsService.updateUserOfDoctor(this.userData.docId, {animals: newAnimalsList})
        .then(() => {
          this.userData.animals = newAnimalsList;
          this.usersOfDoctorsService.setAnimalsToUserOfDoctorList(this.userData, 'docId', 'docId')
          this.uiAlert.setUiError({
            class: UI_ALERTS_CLASSES.SUCCESS,
            message: UI_USERS_OF_DOCTOR_MSGS.SUCCESS_ADDING_ANIMAL_TO_USER_WITHOUT_ACCOUNT
          });
          this.isAddAnimalFormDisplayed = false;
        }).catch((error) => {
        console.error('Error saving animal data to user', error);
        this.uiAlert.setUiError({
          class: UI_ALERTS_CLASSES.ERROR,
          message: UI_USERS_OF_DOCTOR_MSGS.ERROR_UPDATING_ANIMALS_OF_USERS_DOCTORS
        });
      });
    }
  }

  addRecurrentAppointment(period: string) {
    const doctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    const currentDate = new Date();
    let appMinutes;
    if (currentDate.getMinutes() > 0 && currentDate.getMinutes() < 30) {
      appMinutes = 0
    } else {
      appMinutes = 30;
    }
    currentDate.setMinutes(appMinutes);
    const appointmentTime = this.dateUtils.formatTime(currentDate.getHours(), currentDate.getMinutes());
    const appointment = {
      dateTime: this.dateUtils.getDateFormat(currentDate) + ' - ' + appointmentTime,
      timestamp: currentDate.getTime(),
      userEmail: this.userData.email,
      userId: this.userData.id,
      userName: this.userData.name,
      phone: this.userData.phone,
      services: 'Consult medical',
      animalData: {
        name: this.animalData.name,
        uid: this.animalData.id
      },
    }
    this.appointmentService.addRecurrentAppointment(period, doctor, {appointment});
  }

  addUserToDoctorList(user: any) {
    this.usersOfDoctorsService.addUserToDoctorList(user, true)?.then(() => {
      this.searchedUserListElement.nativeElement.classList.add('hide');
      this.nameOrPhoneToSearch = '';
    });
  }

  deleteUserOfDoctorFromList(user: any) {
    this.usersOfDoctorsService.deleteUsersOfDoctors(user)
      .pipe(take(1))
      .subscribe((res) => {
        res.docs.forEach((doc: any) => {
          doc.ref.delete();
          this.usersOfDoctorsService.deleteUsersOfDoctorsFromLocalStorageList(user);
          return;
        });
        this.uiAlert.setUiError({
          class: UI_ALERTS_CLASSES.SUCCESS,
          message: UI_USERS_OF_DOCTOR_MSGS.SUCCESS_DELETING_USER_FROM_LIST
        });
        this.setAllToFalse();
      }, (error: any) => {
        console.error(error);
        this.uiAlert.setUiError({
          class: UI_ALERTS_CLASSES.ERROR,
          message: UI_USERS_OF_DOCTOR_MSGS.ERROR_DELETING_CLIENT_FROM_LIST
        });
      });
  }

  editAnimalData(event: any) {
    if (event.name !== this.animalData.name) {
      // modifica si user of Doctor si user animalList page - batch si
      // mofica localstorage with user list
      let animalList = this.userData.animals.slice();
      animalList.forEach((animal: any) => {
        if (animal.animalId === this.animalData.id) {
          animal.animalName = event.name;
          return;
        }
      })
      this.animalService.updateAnimalsDataFromAllDocs(this.userData.id, this.selectedUserOfDoctor.userDoctor.id, this.animalData.id, animalList, event)
        .then(() => {
          this.animalData = {...event};
          // todo edit localstorage
          this.isEditAnimalDataClicked = false;
        }).catch((error) => {
        this.uiAlert.setUiError({
          message: ANIMAL_SERVICE_MESSAGES.ANIMAL_UPDATE_WITH_ERROR,
          class: UI_ALERTS_CLASSES.ERROR,
        });
      });
    } else {
      this.animalService.updateAnimalsSubCollections(`user/${this.userData.id}/animals`, this.animalData.id, event)
        .then(() => {
          this.animalData = {...event};
          this.isEditAnimalDataClicked = false;
        });
    }
  }

  filterAllUsers() {
    if (!this.isSearchingByPhone) {
      this.userService.getUserByNameOrPhone(this.nameOrPhoneToSearch, '')
        .pipe(take(1))
        .subscribe((res) => {
          this.searchUserList = res;
        });
    } else {
      this.userService.getUserByNameOrPhone('', this.nameOrPhoneToSearch)
        .pipe(take(1))
        .subscribe((res) => {
          this.searchUserList = res;
        });
    }
  }

  getAllUsersDoctors() {
    this.usersOfDoctorsService.getAllUsersOfDoctor()
      .pipe(take(1))
      .subscribe((listOfUsers) => {
        if (listOfUsers) {
          this.listOfClients = this.getSidebarContent(listOfUsers);
          this.usersOfDoctorsService.resetOnlyLocalStorage(listOfUsers);
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

    sidebarContentUserWithAccount.title = this.searchTextPlaceholders.CLIENT_WITH_ACCOUNT.title;
    sidebarContentUserWithoutAccount.title = this.searchTextPlaceholders.CLIENT_WITHOUT_ACCOUNT.title;
    sidebarContentUserWithoutAccount.buttonText = this.searchTextPlaceholders.CLIENT_WITHOUT_ACCOUNT.buttonText;
    sidebarContentUserWithoutAccount.list = this.getSidebarComponentLinks(usersWithoutAccount);
    sidebarContentUserWithAccount.list = this.getSidebarComponentLinks(usersWithAccount);

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

  getAnimalData(animal: IAnimalUserInfo) {
    this.isAddAnimalFormDisplayed = false;
    if (!animal.animalId) {
      this.isAnimalDataFetched = true;
      this.animalData.name = animal.animalName;
      this.uiAlert.setUiError({
        class: UI_ALERTS_CLASSES.ERROR,
        message: UI_USERS_OF_DOCTOR_MSGS.CREATE_AN_ACCOUNT_FOR_USER
      })
    } else if (this.animalData && this.animalData.id === animal.animalId) {
      //if user clicks on the same animal twice
      this.isAnimalDataFetched = true;
      return;
    } else {
      this.animalService.getAnimalById(animal.animalId, this.userData.id)
        .pipe(take(1))
        .subscribe((res) => {
          this.animalData = res;
          this.isAnimalDataFetched = true;
          this.getAnimalMedicalHistory(animal.animalId);
        }, error => {
          console.error("ERROR while fetching animal data: ", JSON.stringify(error));
          this.uiAlert.setUiError({
            class: UI_ALERTS_CLASSES.ERROR,
            message: UI_USERS_OF_DOCTOR_MSGS.ERROR_GETTING_USERS_DATA
          })
        })
    }
  }

  getAnimalMedicalHistory(animalId: string | null) {
    this.isAnimalMedicalHistoryFetched = false;
    // @ts-ignore
    this.animalService.getAnimalsMedicalHistoryDocs(animalId, this.userData.id)
      .pipe(take(1))
      .subscribe((medicalHistoryCollection) => {
        this.isAnimalMedicalHistoryFetched = true;
        if (medicalHistoryCollection.docs && medicalHistoryCollection.docs.length === 0) {
          this.isAnimalMedicalHistoryFetched = false;
          return;
        }
        medicalHistoryCollection.docs.forEach((medicalHistory: any) => {
          this.animalMedicalHistory = medicalHistory.data();
          this.diseasesTitle = USER_ANIMAL_DIALOG.animalDiseases;
          this.recommendationTitle = USER_ANIMAL_DIALOG.medicalHistory;
        });
      }, error => {
        console.error("ERROR while fetching animal medical history: ", JSON.stringify(error));
        this.uiAlert.setUiError({
          class: UI_ALERTS_CLASSES.ERROR,
          message: UI_USERS_OF_DOCTOR_MSGS.ERROR_GETTING_ANIMAL_MEDICAL_HISTORY
        });
      });
  }

  getUserData(link: any) {
    this.selectedUserOfDoctor = link;
    //when clicking on the same link - don't fetch twice same info
    if (this.userData && this.userData.docId === link.userDoctor.id) {
      return;
    }
    if (link && link.id) {
      this.userService.getUserDataById(link.id)
        .pipe(take(1))
        .subscribe((res) => {
          this.userData = {};
          this.animalData = {};
          this.userData = res;
          this.userData.docId = link.userDoctor.id;
          this.userData.isClientRegisteredInApp = true;
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
      this.userData.animals = link.userDoctor.animals;
      this.userData.docId = link.userDoctor.id;
      this.isUserDataFetched = true;
      this.isAnimalDataFetched = false;
      this.isAnimalMedicalHistoryFetched = false;
    }
  }

  onFocusUser(): void {
    if (this.searchedUserListElement.nativeElement.classList.contains('hide')) {
      this.searchedUserListElement.nativeElement.classList.remove('hide');
    }
  }

  openAddAppointmentModal(userOfDoctor: any, animalData: any) {
    if (userOfDoctor.isClientRegisteredInApp) {
      this.dialog.open(DoctorAppointmentModalComponent, {
        height: '40rem',
        panelClass: MODALS_DATA.DOCTOR_APP_MODAL,
        data: {
          date: new Date(),
          userData: userOfDoctor,
          animalData: animalData
        }
      });
    } else {
      this.dialog.open(DoctorAppointmentWithoutUserModalComponent, {
        height: '37rem',
        panelClass: MODALS_DATA.DOCTOR_APP_MODAL,
        data: {
          userOfDoctor,
          animalData
        }
      });
    }
  }

  openCreateUserWithoutAccountDialog(): void {
    this.dialog.open(CreateUserWithoutAccountDialogComponent, {
      minWidth: '20%',
      minHeight: '10rem',
      panelClass: MODALS_DATA.DOCTOR_APP_MODAL,
    });
  }

  saveNewAnimal(animal: any,) {
    if (this.userData.isClientRegisteredInApp) {
      this.userService.updateUserWithAnimalData(animal, this.userData).then(() => {
        this.isAddAnimalFormDisplayed = false;
      });
    } else {
      //TODO TEST update user-doctors
      // add only in localstorage
    }
  }

  setUsersOfDoctors() {
    const storedClients = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));
    if (this.isInitialLoadOfComponent && storedClients) {
      this.usersOfDoctorsSub = this.usersDoctorsListService.usersDoctorsListObs$
        .subscribe((usersDoctorsList) => {
          if (usersDoctorsList) {
            this.listOfClients = this.getSidebarContent(usersDoctorsList);
          }
        });
      this.listOfClients = this.getSidebarContent(storedClients);
    } else if (this.isInitialLoadOfComponent && !storedClients) {
      this.getAllUsersDoctors();
    }
    this.isInitialLoadOfComponent = false;
  }

  setAllToFalse() {
    this.isUserDataFetched = false;
    this.isAnimalMedicalHistoryFetched = false;
    this.isAnimalDataFetched = false;
    this.isEditAnimalDataClicked = false
    this.isAddAnimalFormDisplayed = false;
  }

  toggleEditAndSetAnimalData(animalData: any) {
    this.animalFormData = {
      isAnimalOfFeminineSex: animalData.animalSex === 'F',
      ...this.animalData
    }
    this.isAddAnimalFormDisplayed = false;
    this.isEditAnimalDataClicked = !this.isEditAnimalDataClicked;
  }

  toggleShowAddAnimalForm() {
    this.isAddAnimalFormDisplayed = !this.isAddAnimalFormDisplayed;
    this.isAnimalMedicalHistoryFetched = false;
    this.isAnimalDataFetched = false;
    this.isEditAnimalDataClicked = false
  }
}
