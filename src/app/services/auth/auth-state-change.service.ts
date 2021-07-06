import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {DoctorService} from "../doctor/doctor.service";

@Injectable({
  providedIn: 'root'
})
export class AuthStateChangeService {

  constructor(private afAuth: AngularFireAuth,
              private doctorService: DoctorService) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        if (!user.emailVerified) {
          alert('Please verify your email');
          setTimeout(() => {
            this.afAuth.signOut();
          }, 1500);
          return;
        }
        this.doctorService.getDoctorById(user.uid).subscribe((doctor) => {
          if(!doctor) {
            alert('A aparut o eroare, te rugam sa incerci din nou');
          }
          localStorage.setItem('user', JSON.stringify(doctor));
        });
      } else {
        localStorage.removeItem('user');
      }
    });
  }
}
