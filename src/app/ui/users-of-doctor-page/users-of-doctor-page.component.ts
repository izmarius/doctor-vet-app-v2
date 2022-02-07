import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UsersOfDoctorService} from "../../services/users-of-doctor/users-of-doctor.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {
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
import {CreateUserDialogComponent} from "../create-user-dialog/create-user-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {UsersDoctorsListService} from "../../services/usersDoctorsObservableService/usersDoctorsListService";
import {CreateUserWithoutAccountDialogComponent} from "../create-user-without-account-dialog/create-user-without-account-dialog.component";
import {AppointmentsService} from "../../services/appointments/appointments.service";
import {DateUtilsService} from "../../data/utils/date-utils.service";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";

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
  isSearchingByPhone: boolean = false;
  isUserDataFetched: boolean = false;
  listOfClients: any;
  recommendationTitle!: string;
  searchTextPlaceholders: any;
  searchUserList: any[] = [];
  nameOrPhoneToSearch: string = '';
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
              private usersDoctorsListService: UsersDoctorsListService) {
  }

  ngOnInit(): void {
    const storedClients = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));
    this.searchTextPlaceholders = USERS_DOCTOR_PAGE_CONST;
    if (storedClients) {
      this.usersOfDoctorsSub = this.usersDoctorsListService.usersDoctorsListObs$
        .subscribe((usersDoctorsList) => {
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
    this.usersOfDoctorsSub.unsubscribe();
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
    this.usersOfDoctorsService.addUserToDoctorList(user, true);
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

    // todo create a dto or interface
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

  getUserData(link: any) {
    if (link && link.id) {
      this.userService.getUserDataById(link.id)
        .pipe(take(1))
        .subscribe((res) => {
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
      this.userData.animals = link.userDoctor.animals;
      this.isUserDataFetched = true;
      this.isAnimalDataFetched = false;
      this.isAnimalMedicalHistoryFetched = false;
    }
  }

  getAnimalData(animalId: string) {
    if (animalId) {
      this.animalService.getAnimalById(animalId, this.userData.id)
        .pipe(take(1))
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
    } else {
      this.uiAlert.setUiError({
        class: UI_ALERTS_CLASSES.ERROR,
        message: UI_USERS_OF_DOCTOR_MSGS.CREATE_AN_ACCOUNT_FOR_USER
      })
    }
  }

  getAnimalMedicalHistory(animalId: string) {
    this.animalService.getAnimalsMedicalHistoryDocs(animalId, this.userData.id)
      .pipe(take(1))
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

  onFocusUser(): void {
    if (this.searchedUserListElement.nativeElement.classList.contains('hide')) {
      this.searchedUserListElement.nativeElement.classList.remove('hide');
    }
  }

  openAddAppointmentModal() {

  }

  openModalToAddNewUser(clientTitle: string) {
    if (clientTitle === this.searchTextPlaceholders.CLIENT_WITH_ACCOUNT.title) {
      this.openCreateUserDialog();
    } else if (clientTitle === this.searchTextPlaceholders.CLIENT_WITHOUT_ACCOUNT.title) {
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
