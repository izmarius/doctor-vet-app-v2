import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {USER_LOCALSTORAGE, USER_STATE} from 'src/app/shared-data/Constants';
import {DoctorService} from "../doctor/doctor.service";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthStateChangeService {
  private doctorServiceSubscription!: Subscription;

  constructor(private afAuth: AngularFireAuth,
              private doctorService: DoctorService) {
    this.afAuth.authState.subscribe((user) => {
      if (user && !user.emailVerified) {
        alert(USER_STATE.emailVerified);
      } else if (user && user.emailVerified) {
        this.doctorServiceSubscription = this.doctorService.getDoctorById(user.uid)
          .pipe(take(1))
          .subscribe((doctor) => {
            if (!doctor) {
              alert('A aparut o eroare, te rugam sa incerci din nou');
            }
            // todo handle if not doctor
            localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(doctor));
          });
      } else {
        localStorage.removeItem(USER_LOCALSTORAGE);
      }
    });
  }
}
