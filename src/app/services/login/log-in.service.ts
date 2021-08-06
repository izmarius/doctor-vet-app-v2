import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {FIREBASE_ERRORS, UI_ALERT_MESSAGES, USER_LOCALSTORAGE} from "../../shared-data/Constants";
import {UiErrorInterceptorService} from "../../ui/shared/alert-message/services/ui-error-interceptor.service";

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private uiAlertInterceptor: UiErrorInterceptorService) {
  }

  logIn(email: string, password: string, dialogRef: MatDialogRef<any>): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        dialogRef.close(true);
        this.uiAlertInterceptor.setUiError({message: UI_ALERT_MESSAGES.welcome, class: 'snackbar-success'});
        this.router.navigate(['/appointments'])
      })
      .catch((error) => {
        this.uiAlertInterceptor.setUiError({message: FIREBASE_ERRORS["auth/user-not-found"], class: 'snackbar-error'});
      });
  }

  isLoggedIn(): boolean {
    const user = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    return !(user === null || !user.emailVerified);
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut()
      .then(() => {
        this.router.navigate(['']);
      });
  }
}
