import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {FIREBASE_ERRORS, UI_ALERT_MESSAGES, UI_ALERTS_CLASSES, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {UiErrorInterceptorService} from "../../ui/shared/alert-message/services/ui-error-interceptor.service";

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private uiAlertInterceptor: UiErrorInterceptorService) {
  }

  logIn(email: string, password: string): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.uiAlertInterceptor.setUiError({message: UI_ALERT_MESSAGES.welcome, class: UI_ALERTS_CLASSES.SUCCESS});
      })
      .catch((error) => {
        if(error.code) {
          // @ts-ignore
          this.uiAlertInterceptor.setUiError({message: FIREBASE_ERRORS[error.code], class: UI_ALERTS_CLASSES.ERROR});
          return;
        }
        this.uiAlertInterceptor.setUiError({message: FIREBASE_ERRORS["auth/user-not-found"], class: UI_ALERTS_CLASSES.ERROR});
      });
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut()
      .then(() => {
        this.router.navigate(['']);
      }).catch((error) => {
        console.error(error);
      });
  }
}
