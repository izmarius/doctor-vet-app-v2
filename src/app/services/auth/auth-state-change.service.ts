import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {USER_LOCALSTORAGE, USER_STATE} from 'src/app/shared-data/Constants';
import {DoctorService} from "../doctor/doctor.service";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";
import {UiErrorInterceptorService} from "../../ui/shared/alert-message/services/ui-error-interceptor.service";

@Injectable({
  providedIn: 'root'
})
export class AuthStateChangeService {
  private doctorServiceSubscription!: Subscription;

  constructor(private afAuth: AngularFireAuth,
              private doctorService: DoctorService,
              private uiAlertInterceptor: UiErrorInterceptorService) {
    this.afAuth.authState.subscribe((user) => {
      if (user && !user.emailVerified) {
        this.uiAlertInterceptor.setUiError({message: USER_STATE.emailVerified, class: 'snackbar-error'});
      } else if (user && user.emailVerified) {
        this.doctorServiceSubscription = this.doctorService.getDoctorById(user.uid)
          .pipe(take(1))
          .subscribe((doctor) => {
            if (!doctor) {
              this.uiAlertInterceptor.setUiError({message: USER_STATE.patientNotFound, class: 'snackbar-error'});
            }
            localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(doctor));
          });
      } else {
        localStorage.removeItem(USER_LOCALSTORAGE);
      }
    });
  }
}
