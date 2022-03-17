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
import {UI_ALERTS_CLASSES, USER_SERVICE} from "../../shared-data/Constants";
import {IUserDTO} from "../../ui/user-profile/dto/user-dto";

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  USER_COLLECTION = 'user';

  constructor(
    private afAuth: AngularFireAuth,
    private doctorService: DoctorService,
    private firestoreService: FirestoreService,
    private loginService: LogInService,
    private uiErrorInterceptor: UiErrorInterceptorService,
    private userService: UserService,
    private uiAlertInterceptor: UiErrorInterceptorService
  ) {
  }

  signUpNewUser(userPayload: any) {
    this.firestoreService.getCollectionByWhereClause(this.USER_COLLECTION, 'email', '==', userPayload.email)
      .pipe(take(1))
      .subscribe((users) => {
        if (users && users.length > 0) {
          this.uiAlertInterceptor.setUiError({
            message: USER_SERVICE.USER_ALREADY_EXISTS_WITH_EMAIL,
            class: UI_ALERTS_CLASSES.ERROR
          });
          return;
        }

        this.afAuth.createUserWithEmailAndPassword(userPayload.email, userPayload.password)
          .then(() => {
            this.userService.createUser(this.getUserDTO(userPayload));
          })
          .catch((error) => {
            this.uiErrorInterceptor.setUiError({message: error.message, class: UI_ALERTS_CLASSES.ERROR});
          });
      });
  }

  getUserDTO(userPayload: any): IUserDTO {
    return {
      id: this.firestoreService.getNewFirestoreId(),
      animals: [],
      email: userPayload.email,
      phone: userPayload.phone,
      city: '-',
      photo: '',
      name: userPayload.name
    }
  }

  signUpDoctor(password: string, doctorDTO: DoctorDTO): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(doctorDTO.email, password)
      .then((userCredentials) => {
        userCredentials?.user?.sendEmailVerification();
        if (userCredentials?.user?.uid != undefined) { //used != to catch null too
          doctorDTO.id = userCredentials?.user?.uid;
        }
        this.doctorService.createDoctor(doctorDTO);
        this.loginService.logIn(doctorDTO.email, password);
      })
      .catch((error) => {
        this.uiErrorInterceptor.setUiError({message: error.message, class: UI_ALERTS_CLASSES.ERROR});
      });
  }
}
