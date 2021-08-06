import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import 'firebase/auth';
import {MatDialogRef} from '@angular/material/dialog';
import {SignupDialogComponent} from '../../ui/signup-dialog/signup-dialog.component';
import {DoctorService} from '../doctor/doctor.service';
import {DoctorDTO} from "../../data/model-dto/doctor-DTO";
import {LogInService} from "../login/log-in.service";
import {UiErrorInterceptorService} from "../../ui/shared/alert-message/services/ui-error-interceptor.service";

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(
    private afAuth: AngularFireAuth,
    private doctorService: DoctorService,
    private loginService: LogInService,
    private uiErrorInterceptor: UiErrorInterceptorService
  ) {
  }

  signUpDoctor(password: string, dialogRef: MatDialogRef<SignupDialogComponent>, doctorDTO: DoctorDTO): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(doctorDTO.email, password)
      .then((userCredentials) => {
        userCredentials?.user?.sendEmailVerification();
        doctorDTO.id = userCredentials?.user?.uid;
        this.doctorService.createDoctor(doctorDTO);
        this.loginService.logIn(doctorDTO.email, password, dialogRef);
      })
      .catch((error) => {
        this.uiErrorInterceptor.setUiError({message: error.message, class: 'snackbar-error'});
      });
  }
}
