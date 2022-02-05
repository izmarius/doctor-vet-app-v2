import {Injectable} from '@angular/core';
import {FirestoreService} from "../../data/http/firestore.service";
import {
  UI_ALERTS_CLASSES,
  UI_USERS_OF_DOCTOR_MSGS,
  USER_LOCALSTORAGE
} from "../../shared-data/Constants";
import {UiErrorInterceptorService} from "../../ui/shared/alert-message/services/ui-error-interceptor.service";
import {debounceTime, distinctUntilChanged, map, take} from "rxjs/operators";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersOfDoctorService {
  private doctor: any;
  private USERS_OF_DOCTOR_COLLECTION = 'users-doctors'

  constructor(private firestore: FirestoreService,
              private uiAlert: UiErrorInterceptorService) {
    this.doctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
  }

  filterUsersOfDoctors(name: string): Observable<any> {
    if (name.length > 2) {
      // todo - filter patient after email?
      // first step is to add it to the list of yours and after that you can search the user in appointments
      return this.firestore.getCollectionWhereStringStartsWith(this.USERS_OF_DOCTOR_COLLECTION, 'clientName', '>=', '<=', name)
        .pipe(
          debounceTime(200),
          distinctUntilChanged(),
          map((usersList: any) => {
            debugger;
            return usersList.filter((user: any) => {
              return user.clientName.toLowerCase().indexOf(name.toLowerCase()) > -1
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
    return this.firestore.getCollectionByWhereClause(this.USERS_OF_DOCTOR_COLLECTION, 'doctorId', '==', this.doctor.id)
      .pipe(take(1));
  }

  addUserToDoctorList(usersDoctorPayload: any): Promise<any> {
    if (!this.doctor || !this.doctor.id) {
      this.uiAlert.setUiError({
        class: UI_ALERTS_CLASSES.ERROR,
        message: UI_USERS_OF_DOCTOR_MSGS.NO_LOGGED_IN_DOCTOR
      });
    }

    return this.firestore.saveDocumentByAutoId(this.USERS_OF_DOCTOR_COLLECTION, usersDoctorPayload);
  }
}
