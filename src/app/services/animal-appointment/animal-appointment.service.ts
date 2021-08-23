import {Injectable} from '@angular/core';
import {FirestoreService} from "../../data/http/firestore.service";

@Injectable({
  providedIn: 'root'
})
export class AnimalAppointmentService {
  private USER_COLLECTION = 'user/';
  private ANIMAL_COLLECTION = '/animals/';
  private ANIMAL_APPOINTMENTS_COLLECTION = '/appointments';

  constructor(private firestoreService: FirestoreService) {
  }

  saveAnimalAppointment(animalAppointment: any, userId: string, animalId: string): Promise<any> {
    return this.firestoreService.saveDocumentWithGeneratedFirestoreId('animal-appointments', animalId, JSON.parse(JSON.stringify(animalAppointment)));
  }

  updateAnimalAppointment(animalAppointment: any, userId: string, animalId: string): Promise<any> {
    return this.firestoreService.updateDocumentById('animal-appointments', animalId, JSON.parse(JSON.stringify(animalAppointment)));
  }

  getAnimalAppointmentCollectionURL(userId: string, animalId: string): string {
    return this.USER_COLLECTION + userId + this.ANIMAL_COLLECTION + animalId + this.ANIMAL_APPOINTMENTS_COLLECTION;
  }
}
