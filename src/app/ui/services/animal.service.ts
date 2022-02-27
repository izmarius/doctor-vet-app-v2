import {Injectable} from '@angular/core';
import {FirestoreService} from "../../data/http/firestore.service";
import {Observable} from "rxjs";
import {map, mergeMap, take} from "rxjs/operators";
import {IUserAnimalAndMedicalHistory} from "../user-animal-info/dto/user-animal-medical-history-dto";
import {UserService} from "../user-profile/services/user.service";
import {UiErrorInterceptorService} from "../shared/alert-message/services/ui-error-interceptor.service";
import {ANIMAL_SERVICE_MESSAGES, UI_ALERTS_CLASSES} from "../../shared-data/Constants";
import {BatchService} from "../../services/batch/batch.service";

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  constructor(
    private batchService: BatchService,
    private fireStoreService: FirestoreService,
    private uiAlertMsg: UiErrorInterceptorService,
    private userService: UserService
  ) {
  }

  private USER_COLLECTION = 'user/';
  private ANIMALS_COLLECTION = '/animals';
  private MEDICAL_HISTORY_COLLECTION = '/medical-history';

  getAnimalById(animalId: string | number, userId: string): Observable<any> {
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
                animalMedicalHistory: medicalHistoryCollection.docs.length === 0 ? {
                  diseases: [],
                  recommendations: []
                } : medicalHistoryCollection.docs[0].data(),
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
      console.error(error.message);
    });
  }

  updateAnimalsSubCollections(url: string, documentId: string, documentToUpdate: any): Promise<void> {
    return this.fireStoreService.updateDocumentById(url, documentId, documentToUpdate)
      .then(() => {
        this.uiAlertMsg.setUiError({
          message: ANIMAL_SERVICE_MESSAGES.ANIMAL_UPDATED_WITH_SUCCESS,
          class: UI_ALERTS_CLASSES.SUCCESS,
        });
      }).catch((error) => {
        this.uiAlertMsg.setUiError({
          message: ANIMAL_SERVICE_MESSAGES.ANIMAL_UPDATE_WITH_ERROR,
          class: UI_ALERTS_CLASSES.ERROR,
        });
        console.error(error.message);
      });
  }

  updateAnimalsDataFromAllDocs(userId: string, userDoctorId: string, animalId: string, animals: any, payload: any) {
    const animalDocRef = this.fireStoreService.getDocumentRefByAutogeneratedId(`user/${userId}/animals`, animalId);
    const userDocRef = this.fireStoreService.getDocumentRefByAutogeneratedId('user', userId);
    const userOfDoctorBatchDocument = this.fireStoreService.getDocumentRefByAutogeneratedId('users-doctors', userDoctorId);

    // todo : modifiy only array - data and put limit on adding animals
    const batch = this.fireStoreService.getDbRef().batch();
    batch.update(userDocRef, {animals: animals});
    batch.update(animalDocRef, JSON.parse(JSON.stringify(payload)));
    batch.update(userOfDoctorBatchDocument, {animalData: animals});
    return batch.commit();
  }

  getAnimalUrl(userId: string): string {
    return this.USER_COLLECTION + userId + this.ANIMALS_COLLECTION;
  }
}
