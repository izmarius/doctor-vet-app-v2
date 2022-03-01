import {map, take, mergeMap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {FirestoreService} from 'src/app/data/http/firestore.service';
import {Observable, of} from 'rxjs';
import {UserDTO} from "../dto/user-dto";
import {UiErrorInterceptorService} from "../../shared/alert-message/services/ui-error-interceptor.service";
import {
  FIREBASE_ERRORS,
  UI_ALERTS_CLASSES,
  USER_LOCALSTORAGE,
  USER_SERVICE,
  USERS_DOCTORS
} from "../../../shared-data/Constants";
import {FirebaseUtilsService} from "../../../services/firebase-utils-service/firebase-utils.service";
import {DateUtilsService} from "../../../data/utils/date-utils.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFireFunctions} from "@angular/fire/functions";
import {UsersOfDoctorService} from "../../../services/users-of-doctor/users-of-doctor.service";
import {UsersDoctorsListService} from "../../../services/usersDoctorsObservableService/usersDoctorsListService";
import {BatchService} from "../../../services/batch/batch.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private ANIMAL_COLLECTION = '/animals';
  private DOCTORS_COLLECTION = 'doctors';
  private DEFAULT_PASS = 'bunvenit123';
  private doctor: any;
  private USER_COLLECTION = 'user/';

  constructor(private batchService: BatchService,
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

  private getAnimalDoc(userData: any) {
    return {
      id: userData.animals[0].animalId,
      birthDay: '-',
      bloodType: '-',
      age: 0,
      name: userData.animals[0].animalName,
      weight: 0
    }
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
    this.createUserWithEmailAndPassword(userData)
      .pipe(take(1))
      .subscribe(() => {
          this.firestoreService.saveDocumentWithGeneratedFirestoreId(this.USER_COLLECTION, userData.id, JSON.parse(JSON.stringify(userData)))
            .then(() => {
              // todo : refactor here - to ugly
              const usersList: any[] = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));
              let userToDoctorListBatchDocument = null;
              if (!this.usersDoctorsService.isUserInDoctorsList(usersList, userData)) {
                const userOdDocPayload = this.usersDoctorsService.getUserOfDoc(userData, true)
                userToDoctorListBatchDocument = this.batchService.getMapper(
                  'users-doctors',
                  this.firestoreService.getNewFirestoreId(),
                  userOdDocPayload,
                  'set');
              }

              const animalToUserBatch = this.batchService.getMapper(
                this.USER_COLLECTION + userData.id + this.ANIMAL_COLLECTION,
                userData.animals[0].animalId,
                this.getAnimalDoc(userData),
                'set');

              const batchList = !userToDoctorListBatchDocument ? [animalToUserBatch] : [animalToUserBatch, userToDoctorListBatchDocument]

              this.batchService.createBatch(batchList)
                .then(() => {
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

  getUserDataById(userId: string): Observable<any> {
    return this.firestoreService.getDocById(this.USER_COLLECTION, userId).pipe(take(1));
  }

  createUser(userDto: any): Promise<void> {
    return this.firestoreService.saveDocumentWithGeneratedFirestoreId(this.USER_COLLECTION, userDto.id, userDto)
      .then(() => {
        this.uiAlertInterceptor.setUiError({message: USER_SERVICE.addUserSuccess, class: UI_ALERTS_CLASSES.SUCCESS});
      }).catch((error: any) => {
        this.uiAlertInterceptor.setUiError({message: USER_SERVICE.addUserError, class: UI_ALERTS_CLASSES.ERROR});
        console.error('Error:', error);
      });
  }

  updateUserInfo(userDto: any, userId: string): Promise<void> {
    return this.firestoreService.updateDocumentById(this.USER_COLLECTION, userId, userDto)
      .then(() => {
      })
      .catch((error) => {
        this.uiAlertInterceptor.setUiError({message: error.message, class: UI_ALERTS_CLASSES.ERROR});
        console.error('Error:', error);
      });
  }

  updateUserWithAnimalData(animalPayload: any, userData: any, userDoctorDocId: string): void {
    animalPayload.id = this.firestoreService.getNewFirestoreId();
    userData.animals.push({
      animalName: animalPayload.name,
      animalId: animalPayload.id
    });
    this.updateUserInfo(userData, userData.id)
      .then(() => {
        const animalDataBatchDoc = this.batchService.getMapper(
          this.USER_COLLECTION + userData.id + this.ANIMAL_COLLECTION,
          animalPayload.id,
          animalPayload,
          'set');

        const updateDoctorDataBatchDoc = this.batchService.getMapper(
          'users-doctors',
          userDoctorDocId,
          {animals: userData.animals},
          'update');

        this.batchService.createBatch([animalDataBatchDoc, updateDoctorDataBatchDoc])
          .then(() => {
            let clientList: any[] = JSON.parse(<string>localStorage.getItem(USERS_DOCTORS));
            clientList.forEach((client, index) => {
              if (client.clientId === userData.id) {
                client.animals = userData.animals
                return;
              }
            });
            localStorage.removeItem(USERS_DOCTORS)
            localStorage.setItem(USERS_DOCTORS, JSON.stringify(clientList));
            localStorage.removeItem(USER_LOCALSTORAGE);
            localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(userData));
            this.uiAlertInterceptor.setUiError({
              message: USER_SERVICE.ADD_ANIMAL_TO_USER_WITH_SUCCESS,
              class: UI_ALERTS_CLASSES.SUCCESS
            });
          }).catch((error: any) => {
          this.uiAlertInterceptor.setUiError({
            message: USER_SERVICE.ADD_ANIMAL_TO_USER_WITH_ERROR,
            class: UI_ALERTS_CLASSES.SUCCESS
          });
          console.error(error.message);
        });
      }).catch((error: any) => {
      this.uiAlertInterceptor.setUiError({message: error.message, class: UI_ALERTS_CLASSES.ERROR});
      console.error('Error:', error);
    })
  }
}
