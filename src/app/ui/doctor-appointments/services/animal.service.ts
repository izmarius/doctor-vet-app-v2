import {Injectable} from '@angular/core';
import {FirestoreService} from "../../../data/http/firestore.service";
import {Observable} from "rxjs";
import {map, mergeMap, take} from "rxjs/operators";
import {IUserAnimalAndMedicalHistory} from "../../user-animal-info/dto/user-animal-medical-history-dto";
import {UserService} from "../../user-profile/services/user.service";
import {AnimalDTO} from "../../user-animal-info/dto/animal-dto";

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  constructor(
    private fireStoreService: FirestoreService,
    private userService: UserService
  ) {
  }

  private USER_COLLECTION = 'user/';
  private ANIMALS_COLLECTION = '/animals';
  private MEDICAL_HISTORY_COLLECTION = '/medical-history';

  getAnimalById(animalId: string | number, userId: string): Observable<AnimalDTO> {
    return this.fireStoreService.getDocById(this.getAnimalUrl(userId), animalId as string);
  }

  getAnimalsMedicalHistoryDocs(animalId: string | number, userId: string): Observable<any> {
    const medicalHistoryPath = this.getAnimalUrl(userId) + '/' + animalId + this.MEDICAL_HISTORY_COLLECTION;
    return this.fireStoreService.getAllDocumentsOfCollection(medicalHistoryPath);
  }

  getAnimalDataAndMedicalHistoryByAnimalId(animalId: string | number, userId: string): Observable<IUserAnimalAndMedicalHistory> {
    return this.getAnimalsDataAndMedicalHistories(animalId, userId).pipe(
      mergeMap(animalWithMedicalHistory => {
        return this.userService.getUserDataById(userId)
          .pipe(
            map(userData => {
              return {
                ...animalWithMedicalHistory,
                userData
              };
            })
          );
      })
    );
  }

  getAnimalsDataAndMedicalHistories(animalId: string | number, userId: string): Observable<any> {
    return this.getAnimalById(animalId, userId).pipe(
      mergeMap(animalData => {
        return this.getAnimalsMedicalHistoryDocs(animalId, userId)
          .pipe(
            take(1),
            map((medicalHistoryCollection: any) => {
              return {
                animalData,
                animalMedicalHistory: medicalHistoryCollection.docs.length === 0 ? [] : medicalHistoryCollection.docs[0].data(),
                medicalHistoryDocId: medicalHistoryCollection.docs.length === 0 ? '' : medicalHistoryCollection.docs[0].id
              };
            })
          );
      }));
  }

  createAnimalHistory(url: string, documentId: string, documentToUpdate: any): void {
    this.fireStoreService.saveDocumentWithGeneratedFirestoreId(url, documentId, documentToUpdate)
      .then(() => {
        console.log('Created animal history with success');
      }).catch((error: any) => {
      console.log(error.message);
    });
  }

  updateAnimalsSubCollections(url: string, documentId: string, documentToUpdate: any): void {
    this.fireStoreService.updateDocumentById(url, documentId, documentToUpdate)
      .then(() => {
        console.log('Update success');
      }).catch((error) => {
      console.log(error.message);
    });
  }

  getAnimalUrl(userId: string): string {
    return this.USER_COLLECTION + userId + this.ANIMALS_COLLECTION;
  }
}
