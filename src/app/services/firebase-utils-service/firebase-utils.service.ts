import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class FirebaseUtilsService {

  constructor(private afAuth: AngularFireAuth) {
  }

  resendValidationEmail(): void {
    this.afAuth.user.subscribe((user) => {
      if (!user) {
      } else {
        user.sendEmailVerification();
      }
    });
  }

  sendPasswordReset(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email).catch((err) => {
      // this.uiAlert.setUiAlertMessage(new AlertDTO(err.message, ALERT_STYLE_CLASS.error));
    });
  }
}
