import {Injectable} from '@angular/core';
import {FirestoreService} from "../../data/http/firestore.service";
import {
  UI_ALERTS_CLASSES,
  UI_USERS_OF_DOCTOR_MSGS,
  USER_LOCALSTORAGE, USERS_DOCTORS
} from "../../shared-data/Constants";
import {UiErrorInterceptorService} from "../../ui/shared/alert-message/services/ui-error-interceptor.service";
import {take} from "rxjs/operators";
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
}
