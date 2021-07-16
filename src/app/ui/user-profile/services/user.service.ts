import { map, first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FirestoreService } from 'src/app/data/http/firestore.service';
import { Observable } from 'rxjs';
import { convertSnapshots } from 'src/app/data/utils/firestore-utils.service';
import {UserDTO} from "../dto/user-dto";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private USER_COLLECTION = 'user/';

  constructor(
    private angularFirestore: AngularFirestore,
    private firestoreService: FirestoreService
  ) { }

  setUserData(user: any): Promise<void> {
    const userRef: AngularFirestoreDocument<UserDTO> = this.angularFirestore.doc(`user/${user.uid}`);
    const userData = new UserDTO();
    userData.setUserCity('')
      .setUserEmail(user.email)
      .setUserName('')
      .setUserPhone('')
      .setUserPhoto('');
    return userRef.set(JSON.parse(JSON.stringify(userData)) , { // firestore does not accept custom objects
      merge: true
    });
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

  updateUserInfo(userDto: UserDTO, userId: string): Promise<void> {
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
