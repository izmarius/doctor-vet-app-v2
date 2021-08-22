import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import 'firebase/auth';
import {DoctorService} from '../doctor/doctor.service';
import {DoctorDTO} from "../../data/model-dto/doctor-DTO";
import {LogInService} from "../login/log-in.service";
import {UiErrorInterceptorService} from "../../ui/shared/alert-message/services/ui-error-interceptor.service";
import {UserService} from "../../ui/user-profile/services/user.service";
import {take} from "rxjs/operators";
import {FirestoreService} from "../../data/http/firestore.service";

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  USER_COLLECTION = 'user';
  constructor(
    private afAuth: AngularFireAuth,
    private doctorService: DoctorService,
    private loginService: LogInService,
    private uiErrorInterceptor: UiErrorInterceptorService,
    private userService: UserService,
    private firestoreService: FirestoreService,
    private uiAlertInterceptor: UiErrorInterceptorService
  ) {
  }

  signUpNewUser(userPayload: any) {
    this.firestoreService.getCollectionByWhereClause(this.USER_COLLECTION, 'email', '==', userPayload.email)
      .pipe(take(1))
      .subscribe((users) => {
        if(users && users.length > 0) {
          this.uiAlertInterceptor.setUiError({
            message: 'Userul este deja inregistrat cu acest email',
            class: 'snackbar-error'
          });
          return;
        }
        this.afAuth.createUserWithEmailAndPassword(userPayload.email, userPayload.password)
          .then((userCredentials) => {
            // todo - add default photo to user?
            const userDto = {
              id: userCredentials.user?.uid,
              animals: [],
              email: userPayload.email,
              phone: userPayload.phone,
              city: '-',
              photo: '',
              name: userPayload.name
            }
            this.userService.createUser(userDto);
          })
          .catch((error) => {
            this.uiErrorInterceptor.setUiError({message: error.message, class: 'snackbar-error'});
          });
      });

  }

  signUpWithEmailAndPassword(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  signUpDoctor(password: string, doctorDTO: DoctorDTO): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(doctorDTO.email, password)
      .then((userCredentials) => {
        userCredentials?.user?.sendEmailVerification();
        doctorDTO.id = userCredentials?.user?.uid;
        this.doctorService.createDoctor(doctorDTO);
        this.loginService.logIn(doctorDTO.email, password);
      })
      .catch((error) => {
        this.uiErrorInterceptor.setUiError({message: error.message, class: 'snackbar-error'});
      });
  }
}
