import {Injectable} from '@angular/core';
import {FirestoreService} from '../../data/http/firestore.service';
import {Observable} from 'rxjs';
import {first, map, mergeMap, take} from 'rxjs/operators';
import {convertSnapshots} from '../../data/utils/firestore-utils.service';
import {LogInService} from "../login/log-in.service";
import {DoctorDTO} from "../../data/model-dto/doctor-DTO";
import {USER_LOCALSTORAGE} from "../../shared-data/Constants";

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private DOCTOR_COLLECTION = 'doctors';

  constructor(private firestoreService: FirestoreService, private logInService: LogInService) {
  }

  getAllDoctors(): Observable<DoctorDTO[]> {
    return this.firestoreService.getCollection(this.DOCTOR_COLLECTION)
      .pipe(
        map((snaps) => convertSnapshots<DoctorService>(snaps)),
        first()
      );
  }

  getDoctorById(doctorId: string): Observable<DoctorDTO> {
    return this.firestoreService.getDocById(this.DOCTOR_COLLECTION, doctorId);
  }

  createDoctor(doctorDTO: DoctorDTO): void {
        this.firestoreService.saveDocumentWithCustomId(this.DOCTOR_COLLECTION, doctorDTO, doctorDTO.id)
          .then((res) => {
          console.log('DOCTOR created');
        }).catch((err) => {
          console.log(err);
        });
  }

  updateDoctorInfo(doctor: any, doctorId: string): Promise<void> {
    return this.firestoreService.updateDocumentById(this.DOCTOR_COLLECTION + '/', doctorId, doctor);
  }

  deleteDoctor(doctorId: string): void {
    // todo: see if exists a recursive delete for a document
    this.firestoreService.deleteDocById(this.DOCTOR_COLLECTION + '/', doctorId).then(() => {
      // do something here
    }, (error) => {
      console.log('Error deleting service', error);
    });
  }

  // @ts-ignore
  getLoggedInDoctorId(): any {
    if (this.logInService.isLoggedIn()) {
      return JSON.parse(<string>localStorage.getItem(USER_LOCALSTORAGE));
    }
  }

}
