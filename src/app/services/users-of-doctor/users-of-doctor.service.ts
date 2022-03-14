import {Injectable} from '@angular/core';
import {FirestoreService} from "../../data/http/firestore.service";
import {
  UI_ALERTS_CLASSES,
  UI_USERS_OF_DOCTOR_MSGS,
  USER_LOCALSTORAGE, USERS_DOCTORS
} from "../../shared-data/Constants";
import {UiErrorInterceptorService} from "../../ui/shared/alert-message/services/ui-error-interceptor.service";
import {debounceTime, distinctUntilChanged, map, take} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {UsersDoctorsListService} from "../usersDoctorsObservableService/usersDoctorsListService";
import {IUsersDoctors} from "./users-doctors-interface";

@Injectable({
  providedIn: 'root'
})
export class UsersOfDoctorService {
  private doctor: any;
  private USERS_OF_DOCTOR_COLLECTION = 'users-doctors'

  constructor(private firestore: FirestoreService,
              private uiAlert: UiErrorInterceptorService,
              private userListService: UsersDoctorsListService) {
    this.doctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
  }

  addUsersOfDoctorsToLocalStorageList(usersDoctorPayload: IUsersDoctors) {
    let usersList: IUsersDoctors[] = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));
    usersList.push(usersDoctorPayload);
    this.resetUserDoctorLocalStorageList(usersList);
  }

  addUserToDoctorList(user: any, isClientRegistered: boolean): Promise<IUsersDoctors> | null {
    if (this.isUserInDoctorsList(user)) {
      this.uiAlert.setUiError({
        class: UI_ALERTS_CLASSES.ERROR,
        message: UI_USERS_OF_DOCTOR_MSGS.ERROR_CLIENT_ALREADY_EXISTS
      });
      return null;
    }
    const usersDoctorPayload: IUsersDoctors = this.getUserOfDoc(user, this.doctor, isClientRegistered)
    return this.firestore.saveDocumentWithGeneratedFirestoreId(this.USERS_OF_DOCTOR_COLLECTION, usersDoctorPayload.id, JSON.parse(JSON.stringify(usersDoctorPayload)))
      .then(() => {
        this.addUsersOfDoctorsToLocalStorageList(usersDoctorPayload);
        // todo refactor here and send only the modified element - not urgent
        return usersDoctorPayload;
      }).catch((error: any) => {
        console.error(error);
        this.uiAlert.setUiError({
          class: UI_ALERTS_CLASSES.ERROR,
          message: UI_USERS_OF_DOCTOR_MSGS.ERROR_SAVING_USERS_DOCTORS
        });
      });
  }

  deleteUsersOfDoctors(userDoctor: any) {
    return this.firestore.deleteWhereClauseWithOneKeyValuePair(this.USERS_OF_DOCTOR_COLLECTION, 'id', userDoctor.docId);
  }

  deleteUsersOfDoctorsFromLocalStorageList(user: any) {
    const usersList: any[] = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));
    usersList.forEach((userDoctor, index) => {
      if (userDoctor.clientPhone === user.phone) {
        usersList.splice(index, 1);
        return;
      }
    });
    this.resetUserDoctorLocalStorageList(usersList);
  }

  getUserOfDoc(user: any, doctor: any, isClientRegistered: boolean): IUsersDoctors {
    return {
      animals: user.animals,
      clientId: user.id,
      clientName: user.name,
      clientPhone: user.phone,
      doctorId: doctor.id,
      doctorName: doctor.doctorName,
      id: this.firestore.getNewFirestoreId(),
      isClientRegisteredInApp: isClientRegistered
    }
  }

  isUserInDoctorsList(user: any) {
    const usersList: any[] = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));
    const existingClient = usersList.find((currentClient: any) => {
      return currentClient.clientPhone === user.phone && currentClient.clientName === user.name && currentClient.doctorId === this.doctor.id;
    });
    if (existingClient) {
      this.uiAlert.setUiError({
        class: UI_ALERTS_CLASSES.ERROR,
        message: UI_USERS_OF_DOCTOR_MSGS.ERROR_CLIENT_ALREADY_EXISTS
      });
      return true;
    }
    return false
  }

  filterUsersOfDoctors(name: string, phone: string): Observable<any> {
    let keyToSearch = '';
    let valueToSearch = '';
    if (phone && phone.length > 6) {
      keyToSearch = 'clientPhone'
      valueToSearch = phone;
    } else if (name && name.length > 2) {
      keyToSearch = 'clientName'
      valueToSearch = name;
    }
    if (keyToSearch) {
      // first step is to add it to the list of yours and after that you can search the user in appointments
      return this.firestore.getCollectionWhereStringStartsWith(this.USERS_OF_DOCTOR_COLLECTION, keyToSearch, '>=', '<=', valueToSearch)
        .pipe(
          debounceTime(200),
          distinctUntilChanged(),
          map((usersList: any) => {
            return usersList.filter((user: any) => {
              return user[keyToSearch].toLowerCase().indexOf(name.toLowerCase()) > -1
            });
          }),
          take(1)
        );
    }
    return of([])
  }

  getAllUsersOfDoctor() {
    if (!this.doctor || !this.doctor.id) {
      this.uiAlert.setUiError({
        class: UI_ALERTS_CLASSES.ERROR,
        message: UI_USERS_OF_DOCTOR_MSGS.NO_LOGGED_IN_DOCTOR
      });
      return of([]);
    }
    return this.firestore.getCollectionByWhereClauseSnapshotChanges(this.USERS_OF_DOCTOR_COLLECTION, 'doctorId', '==', this.doctor.id)
      .pipe(take(1),
        map((listOfUsers) => {
          return listOfUsers.map((userOfDoctor: any) => {
            let user = userOfDoctor.payload.doc.data();
            user.docId = userOfDoctor.payload.doc.id;
            return user;
          });
        }));
  }

  setAnimalsToUserOfDoctorList(userData: any, clientKey = 'clientId', userDataKey = 'id') {
    let clientList: IUsersDoctors[] = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));
    clientList.forEach((client, index) => {
      // @ts-ignore
      if (client[clientKey] === userData[userDataKey]) {
        client.animals = userData.animals
        return;
      }
    });
    this.resetUserDoctorLocalStorageList(clientList);
  }

  resetUserDoctorLocalStorageList(usersList: IUsersDoctors[] | null = null) {
    if (!usersList) {
      usersList = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));
    }
    this.resetOnlyLocalStorage(usersList);
    this.userListService.setUsersDoctorList(usersList);
  }

  resetOnlyLocalStorage(clientList: IUsersDoctors[] | null = null) {
    if (!clientList) {
      clientList = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));
    }
    localStorage.removeItem(USERS_DOCTORS)
    localStorage.setItem(USERS_DOCTORS, JSON.stringify(clientList));
    return this;
  }

  updateUserOfDoctor(docId: string, payload: any) {
    return this.firestore.updateDocumentById(this.USERS_OF_DOCTOR_COLLECTION, docId, payload);
  }
}
