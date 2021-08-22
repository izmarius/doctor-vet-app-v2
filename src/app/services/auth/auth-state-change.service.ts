import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {USER_LOCALSTORAGE, USER_STATE} from 'src/app/shared-data/Constants';
import {DoctorService} from "../doctor/doctor.service";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {UiErrorInterceptorService} from "../../ui/shared/alert-message/services/ui-error-interceptor.service";
import {UserService} from "../../ui/user-profile/services/user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthStateChangeService {

  constructor(private afAuth: AngularFireAuth,
              private userService: UserService,
              private uiAlertInterceptor: UiErrorInterceptorService) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // todo: fix in cloud functions
        // if(!user.emailVerified) {
        //   this.uiAlertInterceptor.setUiError({message: USER_STATE.emailVerified, class: 'snackbar-error'});
        // }
        this.userService.getUserByEmail(<string>user.email)
          .pipe(take(1))
          .subscribe((userOrDoctor) => {
            if (!userOrDoctor) {
              this.uiAlertInterceptor.setUiError({message: USER_STATE.patientNotFound, class: 'snackbar-error'});
            }
            localStorage.removeItem(USER_LOCALSTORAGE);
            localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(userOrDoctor));
          });
      } else {
        localStorage.removeItem(USER_LOCALSTORAGE);
      }
    });
  }
}
