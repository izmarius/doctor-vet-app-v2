import {map, first} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {FirestoreService} from 'src/app/data/http/firestore.service';
import {Observable} from 'rxjs';
import {convertSnapshots} from 'src/app/data/utils/firestore-utils.service';
import {UserDTO} from "../dto/user-dto";
import {UiErrorInterceptorService} from "../../shared/alert-message/services/ui-error-interceptor.service";
import {USER_CARD_TXT, USER_SERVICE} from "../../../shared-data/Constants";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private USER_COLLECTION = 'user/';
  private ANIMAL_COLLECTION = '/animals';

  constructor(
    private angularFirestore: AngularFirestore,
    private firestoreService: FirestoreService,
    private uiAlertInterceptor: UiErrorInterceptorService
  ) {
  }

  setUserData(user: any): Promise<void> {
    const userRef: AngularFirestoreDocument<UserDTO> = this.angularFirestore.doc(`user/${user.uid}`);
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
    if(!user.animals) {
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

  createUser(userDto: UserDTO): Promise<void> {
    return this.firestoreService.saveDocumentByAutoId(this.USER_COLLECTION, userDto)
      .then(() => {
        this.uiAlertInterceptor.setUiError({message: USER_SERVICE.addUserSuccess, class: 'snackbar-success'});
      })
      .catch((error) => {
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
