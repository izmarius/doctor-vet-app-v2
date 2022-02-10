import {Injectable} from '@angular/core';
import {FirestoreService} from '../../data/http/firestore.service';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {DoctorDTO} from "../../data/model-dto/doctor-DTO";

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private DOCTOR_COLLECTION = 'doctors';

  constructor(private firestoreService: FirestoreService) {
  }

  getDoctorById(id: string): Observable<any> {
    return this.firestoreService.getDocById(this.DOCTOR_COLLECTION, id);
  }

  getDoctorsByLocation(locality: string): Observable<any> {
    return this.firestoreService.getCollectionByWhereClause(this.DOCTOR_COLLECTION, 'locality', '==', locality)
      .pipe(take(1));
  }

  createDoctor(doctorDTO: DoctorDTO): void {
    this.firestoreService.saveDocumentWithCustomId(this.DOCTOR_COLLECTION, doctorDTO, doctorDTO.id)
      .then((res) => {
        console.log('DOCTOR created');
      }).catch((err) => {
      console.error(err);
    });
  }

  updateDoctorInfo(doctor: any, doctorId: string): Promise<void> {
    return this.firestoreService.updateDocumentById(this.DOCTOR_COLLECTION + '/', doctorId, doctor);
  }
}
