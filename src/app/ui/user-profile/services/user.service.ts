import {map, first} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {FirestoreService} from 'src/app/data/http/firestore.service';
import {Observable} from 'rxjs';
import {convertSnapshots} from 'src/app/data/utils/firestore-utils.service';
import {UserDTO} from "../dto/user-dto";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private USER_COLLECTION = 'user/';
  private ANIMAL_COLLECTION = '/animals';

  constructor(
    private angularFirestore: AngularFirestore,
    private firestoreService: FirestoreService
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

  saveAnimal(user: any, animalName: string): string {
    const payload = {
      id: '',
      birthDay: '-',
      bloodType: '-',
      age: 0,
      name: animalName,
      weight: 0
    }
    const documentId = this.firestoreService.getNewFirestoreId();
    const animalDocumentRef = this.firestoreService.saveDocumentByWithEmptyDoc(this.USER_COLLECTION + user.id + this.ANIMAL_COLLECTION, documentId);
    payload.id = documentId;
    animalDocumentRef.set(payload);
    user.animals.push({
      animalName: animalName,
      animalId: documentId
    })
    const userAnimal = {animals: user.animals}
    this.updateUserInfo(userAnimal, user.id);
    return documentId;
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
        window.alert('User created');
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  updateUserInfo(userDto: any, userId: string): Promise<void> {
    return this.firestoreService.updateDocumentById(this.USER_COLLECTION, userId, userDto)
      .then(() => {
        window.alert('User updated with new info');
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  deleteUser(userId: string): Promise<void> {
    return this.firestoreService.deleteDocById(this.USER_COLLECTION, userId)
      .then(() => {
        window.alert('User deleted');
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
}
