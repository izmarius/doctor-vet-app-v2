import {map, first, take, mergeMap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {FirestoreService} from 'src/app/data/http/firestore.service';
import {Observable, of} from 'rxjs';
import {convertSnapshots} from 'src/app/data/utils/firestore-utils.service';
import {UserDTO} from "../dto/user-dto";
import {UiErrorInterceptorService} from "../../shared/alert-message/services/ui-error-interceptor.service";
import {
  FIREBASE_ERRORS,
  UI_ALERTS_CLASSES,
  USER_LOCALSTORAGE,
  USER_SERVICE,
  USERS_DOCTORS
} from "../../../shared-data/Constants";
import {IUserData} from "../../../shared-data/iuser-data";
import {FirebaseUtilsService} from "../../../services/firebase-utils-service/firebase-utils.service";
import {DateUtilsService} from "../../../data/utils/date-utils.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFireFunctions} from "@angular/fire/functions";
import {UsersOfDoctorService} from "../../../services/users-of-doctor/users-of-doctor.service";
import {UsersDoctorsListService} from "../../../services/usersDoctorsObservableService/usersDoctorsListService";
import {IUsersDoctors} from "../../../services/users-of-doctor/users-doctors-interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private ANIMAL_COLLECTION = '/animals';
  private DOCTORS_COLLECTION = 'doctors';
  private DEFAULT_PASS = 'bunvenit123';
  private doctor: any;
  private USER_COLLECTION = 'user/';

  constructor(
    private firestoreService: FirestoreService,
    private uiAlertInterceptor: UiErrorInterceptorService,
    private firebaseUtils: FirebaseUtilsService,
    private dateUtils: DateUtilsService,
    private afAuth: AngularFireAuth,
    private functions: AngularFireFunctions,
    private usersDoctorsService: UsersOfDoctorService,
    private userDoctorListService: UsersDoctorsListService
  ) {
    this.doctor = JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
  }

  setUserData(user: any): Promise<void> {
    const userRef = this.firestoreService.getDocumentRef(`user/${user.uid}`);
    const userData = new UserDTO();
    userData.setUserCity('')
      .setUserEmail(user.email)
      .setUserName('')
      .setUserPhone('')
      .setUserPhoto('');
    return userRef.set(JSON.parse(JSON.stringify(userData)), { // firestore does not accept custom objects
      merge: true
    });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.firestoreService.getCollectionByWhereClause(this.USER_COLLECTION, 'email', '==', email)
      .pipe(
        take(1),
        mergeMap(users => {
          if (users && users.length > 0) {
            return of(users[0]);
          } else {
            return this.firestoreService.getCollectionByWhereClause(this.DOCTORS_COLLECTION, 'email', '==', email)
              .pipe(
                take(1),
                map(doctors => {
                  return doctors[0];
                })
              );
          }
        })
      );
  }

  getUserByNameOrPhone(name: string, phone: string) {
    let keyToSearch = '';
    let valueToSearch = '';
    if (phone && phone.length > 6) {
      keyToSearch = 'phone'
      valueToSearch = phone;
    } else if (name && name.length > 2) {
      keyToSearch = 'name'
      valueToSearch = name;
    }
    if (keyToSearch) {
      // first step is to add it to the list of yours and after that you can search the user in appointments
      return this.firestoreService.getCollectionWhereStringStartsWith(this.USER_COLLECTION, keyToSearch, '>=', '<=', valueToSearch)
        .pipe(
          debounceTime(200),
          distinctUntilChanged(),
          map((usersList: any) => {
            return usersList.filter((user: any) => {
              return user[keyToSearch].toLowerCase().indexOf(valueToSearch.toLowerCase()) > -1
            });
          }),
          take(1)
        );
    }
    return of([])
  }

  saveAnimalToUser(userData: any, userDocId: string): Promise<any> {
    const animalPayload = {
      id: userData.animals[0].animalId,
      birthDay: '-',
      bloodType: '-',
      age: 0,
      name: userData.animals[0].animalName,
      weight: 0
    }
    return this.firestoreService.saveDocumentWithGeneratedFirestoreId(
      this.USER_COLLECTION + userDocId + this.ANIMAL_COLLECTION,
      userData.animals[0].animalId, animalPayload);
  }

  createUserWithEmailAndPassword(user: any): Observable<any> {
    const userAuthPayload = {
      email: user.email,
      password: this.DEFAULT_PASS
    }
    const createUser = this.functions.httpsCallable('createUserByDoctor');
    return createUser(userAuthPayload);
  }

  createUserByDoctorAuthAndSaveAnimal(userData: any, dialog: any): void {
    userData.animals[0].animalId = this.firestoreService.getNewFirestoreId();
    // todo handle this with a cloud function?
    // todo refactor!!!!
    this.createUserWithEmailAndPassword(userData)
      .pipe(take(1))
      .subscribe(() => {
          userData.id = this.firestoreService.getNewFirestoreId();
          // transaction here
          this.firestoreService.saveDocumentWithGeneratedFirestoreId(this.USER_COLLECTION, userData.id, JSON.parse(JSON.stringify(userData)))
            .then(() => {
              Promise.all([
                this.saveAnimalToUser(userData, userData.id),
                this.usersDoctorsService.addUserToDoctorList(userData, true)
              ]).then(() => {
                this.firebaseUtils.resendValidationEmail();
                this.uiAlertInterceptor.setUiError({
                  message: USER_SERVICE.addUserSuccess,
                  class: UI_ALERTS_CLASSES.SUCCESS
                });
              }).catch((error) => {
                this.uiAlertInterceptor.setUiError({
                  message: USER_SERVICE.addUserError,
                  class: UI_ALERTS_CLASSES.SUCCESS
                });
                console.error("ERROR", error);
              })
              dialog.close();
            }).catch((error: any) => {
            console.error('Error: ', error);
            this.uiAlertInterceptor.setUiError({
              message: USER_SERVICE.addUserError,
              class: UI_ALERTS_CLASSES.ERROR
            });
          });
        },
        (error: any) => {
          if (error && FIREBASE_ERRORS[error.code]) {
            this.uiAlertInterceptor.setUiError({
              message: FIREBASE_ERRORS[error.code],
              class: UI_ALERTS_CLASSES.ERROR
            });
          } else {
            this.uiAlertInterceptor.setUiError({
              message: error.code,
              class: UI_ALERTS_CLASSES.ERROR
            });
          }
        });
  }

  saveAnimal(user: any, animalName: string, animalDocUid: string): void {
    const payload = {
      id: animalDocUid,
      birthDay: '-',
      bloodType: '-',
      age: 0,
      name: animalName,
      weight: 0
    }
    const animalDocumentRef = this.firestoreService.saveDocumentWithEmptyDoc(this.USER_COLLECTION + user.id + this.ANIMAL_COLLECTION, animalDocUid);
    animalDocumentRef.set(payload);
    if (!user.animals) {
      // todo: refactor and don't do the check
      user.animals = [];
    }
    user.animals.push({
      animalName: animalName,
      animalId: animalDocUid
    })
    const userAnimal = {animals: user.animals}
    this.updateUserInfo(userAnimal, user.id);
  }

  getUserDataById(userId: string): Observable<any> {
    return this.firestoreService.getDocById(this.USER_COLLECTION, userId).pipe(take(1));
  }

  createUser(userDto: any): Promise<void> {
    return this.firestoreService.saveDocumentWithGeneratedFirestoreId(this.USER_COLLECTION, userDto.id, userDto)
      .then(() => {
        this.uiAlertInterceptor.setUiError({message: USER_SERVICE.addUserSuccess, class: UI_ALERTS_CLASSES.SUCCESS});
      }).catch((error: any) => {
        this.uiAlertInterceptor.setUiError({message: USER_SERVICE.addUserError, class: UI_ALERTS_CLASSES.ERROR});
        console.log('Error:', error);
      });
  }

  updateUserInfo(userDto: any, userId: string): Promise<void> {
    return this.firestoreService.updateDocumentById(this.USER_COLLECTION, userId, userDto)
      .then(() => {
      })
      .catch((error) => {
        this.uiAlertInterceptor.setUiError({message: error.message, class: UI_ALERTS_CLASSES.ERROR});
        console.log('Error:', error);
      });
  }

  updateUserWithAnimalData(animalPayload: any, userData: any): void {
    animalPayload.id = this.firestoreService.getNewFirestoreId();
    userData.animals.push({
      animalName: animalPayload.name,
      animalId: animalPayload.id
    });
    this.updateUserInfo(userData, userData.id).then(() => {
      this.firestoreService.saveDocumentWithGeneratedFirestoreId(this.USER_COLLECTION + userData.id + this.ANIMAL_COLLECTION, animalPayload.id, animalPayload)
        .then(() => {
          localStorage.removeItem(USER_LOCALSTORAGE);
          localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(userData));
          this.uiAlertInterceptor.setUiError({
            message: 'Animalul a fost adaugat cu succes',
            class: UI_ALERTS_CLASSES.SUCCESS
          });
        }).catch((error: any) => {
        this.uiAlertInterceptor.setUiError({
          message: 'A aparut o eroare, te rugam sa incerci din nou',
          class: UI_ALERTS_CLASSES.SUCCESS
        });
        console.error(error.message);
      });
    }).catch((error: any) => {
      this.uiAlertInterceptor.setUiError({message: error.message, class: UI_ALERTS_CLASSES.ERROR});
      console.error('Error:', error);
    })
  }

  deleteUser(userId: string): Promise<void> {
    return this.firestoreService.deleteDocById(this.USER_COLLECTION, userId)
      .then(() => {
        this.uiAlertInterceptor.setUiError({message: USER_SERVICE.deleteUserSuccess, class: UI_ALERTS_CLASSES.SUCCESS});
      })
      .catch((error) => {
        this.uiAlertInterceptor.setUiError({message: USER_SERVICE.deleteUserError, class: UI_ALERTS_CLASSES.ERROR});
        console.log('Error:', error);
      });
  }
}
