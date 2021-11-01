import {map, first, take, mergeMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {FirestoreService} from 'src/app/data/http/firestore.service';
import {Observable, of} from 'rxjs';
import {convertSnapshots} from 'src/app/data/utils/firestore-utils.service';
import {UserDTO} from "../dto/user-dto";
import {UiErrorInterceptorService} from "../../shared/alert-message/services/ui-error-interceptor.service";
import {USER_LOCALSTORAGE, USER_SERVICE} from "../../../shared-data/Constants";
import {IUserData} from "../../../shared-data/iuser-data";
import {FirebaseUtilsService} from "../../../services/firebase-utils-service/firebase-utils.service";
import {DateUtilsService} from "../../../data/utils/date-utils.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private USER_COLLECTION = 'user/';
  private DOCTORS_COLLECTION = 'doctors';
  private ANIMAL_COLLECTION = '/animals';

  constructor(
    private firestoreService: FirestoreService,
    private uiAlertInterceptor: UiErrorInterceptorService,
    private firebaseUtils: FirebaseUtilsService,
    private dateUtils: DateUtilsService
  ) {
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

  createUserByDoctorAuthAndSaveAnimal(userData: IUserData, dialog: any): void {
    const userPayload = {
      city: '-',
      email: userData.email,
      phone: userData.phone,
      photo: '',
      name: userData.name,
      animals: [],
      id: ''
    }
    if (userData.animalName) {
      // @ts-ignore
      userPayload.animals[0] = {};
      // @ts-ignore
      userPayload.animals[0].animalId = this.firestoreService.getNewFirestoreId();
      // @ts-ignore
      userPayload.animals[0].animalName = userData.animalName;
    }

    this.firestoreService.getCollectionByWhereClause(this.USER_COLLECTION, 'email', '==', userData.email)
      .pipe(take(1))
      .subscribe((res) => {
        if (res && res.length === 0) {
          userPayload.id = this.firestoreService.getNewFirestoreId();
          this.firestoreService.saveDocumentWithGeneratedFirestoreId(this.USER_COLLECTION, userPayload.id, JSON.parse(JSON.stringify(userPayload)))
            .then(() => {
              // todo make it as a transaction!
              if (userData.animalName) {
                this.saveAnimalToUser(userPayload, userPayload.id).then(() => {
                  this.firebaseUtils.resendValidationEmail();
                  this.uiAlertInterceptor.setUiError({
                    message: 'Userul a fost adaugat cu succes',
                    class: 'snackbar-success'
                  });
                });
              } else {
                this.uiAlertInterceptor.setUiError({
                  message: 'Userul a fost adaugat cu succes',
                  class: 'snackbar-success'
                });
              }
              dialog.close();
            }).catch((error: any) => {
            console.error('Error: ', error);
            this.uiAlertInterceptor.setUiError({
              message: 'O eroare a aparut la crearea userului',
              class: 'snackbar-error'
            });
          });
        } else {
          this.uiAlertInterceptor.setUiError({message: 'Userul este deja inregistrat', class: 'snackbar-error'});
        }
      });
  }

  getAllCurrentUserAppointments(userData: any) {
    // todo - save appointment  to a different collection to fetch here?
    const timestamps = this.dateUtils.setAndGetDateToFetch();
    return this.firestoreService.getCollectionByTimestampAndUserId('animal-appointments', timestamps, 'userId', userData.id);
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
    return this.firestoreService.getDocById(this.USER_COLLECTION, userId);
  }

  getAllUsers(): Observable<UserDTO[]> {
    return this.firestoreService.getCollection(this.USER_COLLECTION)
      .pipe(
        map((snaps) => convertSnapshots<UserDTO>(snaps)),
        first()
      );
  }

  createUser(userDto: any): Promise<void> {
    return this.firestoreService.saveDocumentWithGeneratedFirestoreId(this.USER_COLLECTION, userDto.id, userDto)
      .then(() => {
        this.uiAlertInterceptor.setUiError({message: USER_SERVICE.addUserSuccess, class: 'snackbar-success'});
      }).catch((error: any) => {
        this.uiAlertInterceptor.setUiError({message: USER_SERVICE.addUserError, class: 'snackbar-error'});
        console.log('Error:', error);
      });
  }

  updateUserInfo(userDto: any, userId: string): Promise<void> {
    return this.firestoreService.updateDocumentById(this.USER_COLLECTION, userId, userDto)
      .then(() => {
      })
      .catch((error) => {
        this.uiAlertInterceptor.setUiError({message: error.message, class: 'snackbar-error'});
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
          this.uiAlertInterceptor.setUiError({message: 'Animalul a fost adaugat cu succes', class: 'snackbar-success'});
        }).catch((error: any) => {
        this.uiAlertInterceptor.setUiError({
          message: 'A aparut o eroare, te rugam sa incerci din nou',
          class: 'snackbar-success'
        });
        console.error(error.message);
      });
    }).catch((error: any) => {
      this.uiAlertInterceptor.setUiError({message: error.message, class: 'snackbar-error'});
      console.error('Error:', error);
    })
  }

  deleteUser(userId: string): Promise<void> {
    return this.firestoreService.deleteDocById(this.USER_COLLECTION, userId)
      .then(() => {
        this.uiAlertInterceptor.setUiError({message: USER_SERVICE.deleteUserSuccess, class: 'snackbar-success'});
      })
      .catch((error) => {
        this.uiAlertInterceptor.setUiError({message: USER_SERVICE.deleteUserError, class: 'snackbar-error'});
        console.log('Error:', error);
      });
  }
}
