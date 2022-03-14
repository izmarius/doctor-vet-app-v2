import {map, take, mergeMap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {FirestoreService} from 'src/app/data/http/firestore.service';
import {Observable, of} from 'rxjs';
import {IUserDTO, UserDTO} from "../dto/user-dto";
import {UiErrorInterceptorService} from "../../shared/alert-message/services/ui-error-interceptor.service";
import {
  FIREBASE_ERRORS,
  UI_ALERTS_CLASSES,
  USER_LOCALSTORAGE,
  USER_SERVICE,
} from "../../../shared-data/Constants";
import {FirebaseUtilsService} from "../../../services/firebase-utils-service/firebase-utils.service";
import {DateUtilsService} from "../../../data/utils/date-utils.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFireFunctions} from "@angular/fire/functions";
import {UsersOfDoctorService} from "../../../services/users-of-doctor/users-of-doctor.service";
import {BatchService} from "../../../services/batch/batch.service";
import {MatDialogRef} from "@angular/material/dialog";
import {IAnimalDoc} from "../../dto/animal-util-info";
import {BatchDocuments} from "../../../services/batch/BatchInterface";
import {LoaderService} from "../../../services/loader/loader.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private ANIMAL_COLLECTION = '/animals';
  private DOCTORS_COLLECTION = 'doctors';
  private doctor: any;
  private USER_COLLECTION = 'user/';

  constructor(private batchService: BatchService,
              private firestoreService: FirestoreService,
              private uiAlertInterceptor: UiErrorInterceptorService,
              private firebaseUtils: FirebaseUtilsService,
              private loaderService: LoaderService,
              private dateUtils: DateUtilsService,
              private afAuth: AngularFireAuth,
              private functions: AngularFireFunctions,
              private usersDoctorsService: UsersOfDoctorService,
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

  private getAnimalDoc(userData: any): IAnimalDoc {
    return {
      animalSex: 'F',
      age: 0,
      birthDay: this.dateUtils.getDateFormat(new Date()),
      bloodType: '-',
      id: userData.animals[0].animalId,
      isAnimalSterilized: false,
      name: userData.animals[0].animalName,
      weight: 0
    }
  }

  getUserPayload(animalName: string, animalId: string | null, city: string, email: string, name: string, phone: string, photo: string): IUserDTO {
    return {
      animals: [{
        animalName,
        animalId
      }],
      city,
      email,
      name,
      phone,
      photo,
    }
  }

  createUserWithEmailAndPassword(user: any):
    Observable<any> {
    const userAuthPayload = {
      email: user.email,
    }
    const createUser = this.functions.httpsCallable('createUserByDoctor');
    return createUser(userAuthPayload);
  }

  createUserByDoctorAuthAndSaveAnimal(userData: IUserDTO, dialog: MatDialogRef<any>): void {
    userData.animals[0].animalId = this.firestoreService.getNewFirestoreId();
    this.loaderService.show();
    this.createUserWithEmailAndPassword(userData)
      .pipe(take(1))
      .subscribe(() => {
          userData.id = this.firestoreService.getNewFirestoreId();
          if (this.usersDoctorsService.isUserInDoctorsList(userData)) {
            this.usersDoctorsService.deleteUsersOfDoctorsFromLocalStorageList(userData);
          }
          const userOfDocPayload = this.usersDoctorsService.getUserOfDoc(userData, this.doctor, true);
          let userToDoctorListBatchDocument = this.batchService.getMapper(
            'users-doctors',
            userOfDocPayload.id,
            userOfDocPayload,
            'set');

          const setUserDataBatchDoc = this.batchService.getMapper(
            this.USER_COLLECTION,
            userData.id,
            JSON.parse(JSON.stringify(userData)),
            'set');

          const animalToUserBatch = this.batchService.getMapper(
            this.USER_COLLECTION + userData.id + this.ANIMAL_COLLECTION,
            userData.animals[0].animalId,
            this.getAnimalDoc(userData),
            'set');

          const batchList = !userToDoctorListBatchDocument ? [setUserDataBatchDoc, animalToUserBatch] : [setUserDataBatchDoc, animalToUserBatch, userToDoctorListBatchDocument]

          this.batchService.createBatch(batchList)
            .then(() => {
              this.loaderService.hide();
              this.usersDoctorsService.addUsersOfDoctorsToLocalStorageList(userOfDocPayload)
              this.firebaseUtils.resendValidationEmail();
              this.uiAlertInterceptor.setUiError({
                message: USER_SERVICE.addUserSuccess,
                class: UI_ALERTS_CLASSES.SUCCESS
              });
            }).catch((error) => {
            this.loaderService.hide();
            this.uiAlertInterceptor.setUiError({
              message: USER_SERVICE.addUserError,
              class: UI_ALERTS_CLASSES.SUCCESS
            });
            console.error("ERROR", error);
          })
          dialog.close();
        },
        (error: any) => {
          this.loaderService.hide();
          if (error && FIREBASE_ERRORS[error.code]) {
            this.uiAlertInterceptor.setUiError({
              message: FIREBASE_ERRORS[error.code],
              class: UI_ALERTS_CLASSES.ERROR
            });
          } else {
            // todo: IMPORTANT : WHY IS THROWN FROM CLOUD FUNCTION AN UNHANDLED ERROR?
            this.uiAlertInterceptor.setUiError({
              message: USER_SERVICE.USER_ALREADY_EXISTS_WITH_EMAIL,
              class: UI_ALERTS_CLASSES.ERROR
            });
          }
        });
  }

  getUserDataById(userId: string): Observable<any> {
    return this.firestoreService.getDocById(this.USER_COLLECTION, userId).pipe(take(1));
  }

  createUser(userDto: IUserDTO): Promise<void> {
    // @ts-ignore
    return this.firestoreService.saveDocumentWithGeneratedFirestoreId(this.USER_COLLECTION, userDto.id, userDto)
      .then(() => {
        this.uiAlertInterceptor.setUiError({message: USER_SERVICE.addUserSuccess, class: UI_ALERTS_CLASSES.SUCCESS});
      }).catch((error: any) => {
        this.uiAlertInterceptor.setUiError({message: USER_SERVICE.addUserError, class: UI_ALERTS_CLASSES.ERROR});
        console.error('Error:', error);
      });
  }

  setUserDataToLocalStorage(userData: any) {
    localStorage.removeItem(USER_LOCALSTORAGE);
    localStorage.setItem(USER_LOCALSTORAGE, JSON.stringify(userData));
  }

  updateAllUserDoctorAndUserWithAnimalData(animalPayload: IAnimalDoc, userData: IUserDTO): Observable<any> {
    // @ts-ignore
    this.loaderService.show();
    // @ts-ignore
    return this.firestoreService.getCollectionByWhereClauseSnapshotChanges('users-doctors', 'clientId', '==', userData.id)
      .pipe(
        take(1),
        map((userDocSnaps) => {
          const usersDoctorsBatchList: BatchDocuments[] = [];
          animalPayload.id = this.firestoreService.getNewFirestoreId();
          const animalUserData = {
            animalName: animalPayload.name,
            animalId: animalPayload.id
          }
          userDocSnaps.map((snap: any) => {
            let userDoctor = snap.payload.doc.data();
            userDoctor.animals.push(animalUserData)

            const updateDoctorDataBatchDoc = this.batchService.getMapper(
              'users-doctors',
              userDoctor.id,
              {animals: userDoctor.animals},
              'update');
            usersDoctorsBatchList.push(updateDoctorDataBatchDoc);
          });

          userData.animals.push(animalUserData);
          const updateUserDataBatchDoc = this.batchService.getMapper(
            'user',
            userData.id,
            userData,
            'update');

          const animalDataBatchDoc = this.batchService.getMapper(
            this.USER_COLLECTION + userData.id + this.ANIMAL_COLLECTION,
            animalPayload.id,
            animalPayload,
            'set');

          return this.batchService.createBatch([updateUserDataBatchDoc, animalDataBatchDoc, ...usersDoctorsBatchList])
            .then(() => {

              this.uiAlertInterceptor.setUiError({
                message: USER_SERVICE.ADD_ANIMAL_TO_USER_WITH_SUCCESS,
                class: UI_ALERTS_CLASSES.SUCCESS
              });
            }).catch((error: any) => {
              this.loaderService.hide()
              this.uiAlertInterceptor.setUiError({
                message: USER_SERVICE.ADD_ANIMAL_TO_USER_WITH_ERROR,
                class: UI_ALERTS_CLASSES.ERROR
              });
              console.error(error.message);
            });
        }));
  }

  updateUserWithAnimalData(animalPayload: IAnimalDoc, userData: any): Promise<void> {
    animalPayload.id = this.firestoreService.getNewFirestoreId();
    userData.animals.push({
      animalName: animalPayload.name,
      animalId: animalPayload.id
    });

    const updateUserDataBatchDoc = this.batchService.getMapper(
      'user',
      userData.id,
      userData,
      'update');

    const animalDataBatchDoc = this.batchService.getMapper(
      this.USER_COLLECTION + userData.id + this.ANIMAL_COLLECTION,
      animalPayload.id,
      animalPayload,
      'set');

    const updateDoctorDataBatchDoc = this.batchService.getMapper(
      'users-doctors',
      userData.docId,
      {animals: userData.animals},
      'update');

    return this.batchService.createBatch([updateUserDataBatchDoc, animalDataBatchDoc, updateDoctorDataBatchDoc])
      .then(() => {
        this.usersDoctorsService.setAnimalsToUserOfDoctorList(userData);
        this.uiAlertInterceptor.setUiError({
          message: USER_SERVICE.ADD_ANIMAL_TO_USER_WITH_SUCCESS,
          class: UI_ALERTS_CLASSES.SUCCESS
        });
      }).catch((error: any) => {
        this.uiAlertInterceptor.setUiError({
          message: USER_SERVICE.ADD_ANIMAL_TO_USER_WITH_ERROR,
          class: UI_ALERTS_CLASSES.ERROR
        });
        console.error(error.message);
      });
  }
}
