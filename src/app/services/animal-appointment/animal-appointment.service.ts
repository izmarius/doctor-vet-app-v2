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

  saveAnimalAppointment(animalAppointment: any, userId: string, animalId: string, animalAppointmentId: string): Promise<any> {
    const url = this.getAnimalAppointmentCollectionURL(userId, animalId);
    return this.firestoreService.saveDocumentWithGeneratedFirestoreId(url, animalAppointmentId, JSON.parse(JSON.stringify(animalAppointment)));
  }

  updateAnimalAppointment(animalAppointment: any, userId: string, animalId: string, animalAppointmentId: string): Promise<any> {
    const url = this.getAnimalAppointmentCollectionURL(userId, animalId);
    return this.firestoreService.updateDocumentById(url, animalAppointmentId, JSON.parse(JSON.stringify(animalAppointment)));
  }

  getAnimalAppointmentCollectionURL(userId: string, animalId: string): string {
    return this.USER_COLLECTION + userId + this.ANIMAL_COLLECTION + animalId + this.ANIMAL_APPOINTMENTS_COLLECTION;
  }
}
