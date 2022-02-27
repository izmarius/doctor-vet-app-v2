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

  addUserToDoctorList(user: any, isClientRegistered: boolean): Promise<any> | null {
    if (!this.doctor || !this.doctor.id) {
      this.uiAlert.setUiError({
        class: UI_ALERTS_CLASSES.ERROR,
        message: UI_USERS_OF_DOCTOR_MSGS.NO_LOGGED_IN_DOCTOR
      });
    }
    const usersList: any[] = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));
    if (this.isUserInDoctorsList(usersList, user)) {
      return null;
    }
    const usersDoctorPayload: IUsersDoctors = {
      animals: user.animals,
      clientId: user.id,
      clientName: user.name,
      clientPhone: user.phone,
      doctorId: this.doctor.id,
      doctorName: this.doctor.doctorName,
      isClientRegisteredInApp: isClientRegistered,
      id: this.firestore.getNewFirestoreId()
    }

    return this.firestore.saveDocumentWithGeneratedFirestoreId(this.USERS_OF_DOCTOR_COLLECTION, usersDoctorPayload.id,  usersDoctorPayload)
      .then(() => {
        usersList.push(usersDoctorPayload);
        localStorage.removeItem(USERS_DOCTORS);
        localStorage.setItem(USERS_DOCTORS, JSON.stringify(usersList));
        // todo refactor here and send only the modified element - not urgent
        this.userListService.setUsersDoctorList(usersList);
      }).catch((error: any) => {
        console.error(error);
        this.uiAlert.setUiError({
          class: UI_ALERTS_CLASSES.ERROR,
          message: UI_USERS_OF_DOCTOR_MSGS.ERROR_SAVING_USERS_DOCTORS
        });
      });
  }

  deleteUsersOfDoctors(userDoctor: any) {
    this.firestore.deleteWhereClause(this.USERS_OF_DOCTOR_COLLECTION, 'clientPhone', userDoctor.phone, 'doctorId', this.doctor.id)
      .pipe(take(1))
      .subscribe((res) => {
        let usersList: any[] = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));
        res.docs.forEach((doc: any) => {
          doc.ref.delete();
          usersList = usersList.filter((userOfDoctor) => {
            return userOfDoctor.clientPhone !== doc.data().clientPhone;
          });
        });
        localStorage.removeItem(USERS_DOCTORS);
        localStorage.setItem(USERS_DOCTORS, JSON.stringify(usersList));
        this.userListService.setUsersDoctorList(usersList);
      }, (error: any) => {
        console.error(error)
        ;this.uiAlert.setUiError({
          class: UI_ALERTS_CLASSES.ERROR,
          message: UI_USERS_OF_DOCTOR_MSGS.ERROR_DELETING_CLIENT_FROM_LIST
        });
      })
  }

  getUserOfDoc(user: any, isClientRegistered: boolean){
    return {
      animals: user.animals,
      clientId: user.id,
      clientName: user.name,
      clientPhone: user.phone,
      doctorId: this.doctor.id,
      doctorName: this.doctor.doctorName,
      isClientRegisteredInApp: isClientRegistered
    }
  }

  isUserInDoctorsList(usersList: any[], user: any) {
    const existingClient = usersList.find((currentClient: any) => {
      return currentClient.clientPhone === user.phone && currentClient.doctorId === this.doctor.id;
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

  updateUserOfDoctor(docId: string, payload: any) {
    return this.firestore.updateDocumentById(this.USERS_OF_DOCTOR_COLLECTION, docId, payload);
  }
}
