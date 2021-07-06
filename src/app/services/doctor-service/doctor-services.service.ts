import {Injectable} from '@angular/core';
import {FirestoreService} from '../../data/http/firestore.service';
import {Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';
import {convertSnapshots} from '../../data/utils/firestore-utils.service';
import {DoctorServiceDTO} from "../../data/model-dto/dorctor-service-DTO";

@Injectable({
  providedIn: 'root'
})
export class DoctorServicesService {
  private DOCTOR_COLLECTION = 'doctors/';
  private SERVICES_COLLECTION = '/services';

  constructor(private firestoreService: FirestoreService) {
  }

  getAllServices(doctorId: string): Observable<DoctorServiceDTO> {
    return this.firestoreService.getCollection(this.getServiceUrl(doctorId))
      .pipe(
        map((snaps) => convertSnapshots<DoctorServiceDTO>(snaps)),
        first()
      );
  }

  createService(serviceDTO: DoctorServiceDTO, doctorId: string): void {
    // todo: here will come db services + new services as a list
    this.getAllServices(doctorId).pipe(
      map(s => {
        // @ts-ignore
        const numOfServices = s[0].services.length;
        // @ts-ignore
        if ((s || numOfServices > 0) && serviceDTO.id === s[0].id) {
          // check if service already exists in array
          if (numOfServices !== serviceDTO.services.length) {
            this.updateService(serviceDTO, doctorId);
          }
          return;
        }

        this.firestoreService.saveDocumentByAutoId(this.getServiceUrl(doctorId), serviceDTO).then((res) => {
          console.log('service created');
        }).catch((err) => {
          console.log(err);
        });
        return;
      })).subscribe((res) => {
      console.log(res);
    });
  }

  updateService(services: DoctorServiceDTO, doctorId: string): void {
    this.firestoreService.updateDocumentById(this.getServiceUrl(doctorId), services.id, services)
      .then(() => {
        // do something here
        console.log('service updated');
      }, (error) => {
        console.log('Error updating service', error);
      });
  }

  deleteService(serviceId: string, doctorId: string): void {
    this.firestoreService.deleteDocById(this.getServiceUrl(doctorId), serviceId).then(() => {
      // do something here
    }, (error) => {
      console.log('Error deleting service', error);
    });
  }

  getServiceUrl(doctorId: string): string {
    return this.DOCTOR_COLLECTION + doctorId + this.SERVICES_COLLECTION;
  }

  getDoctorServices(doctorId: string): Observable<any> {
    return this.getAllServices(doctorId).pipe(
      // @ts-ignore
      map((docServices) => docServices[0].services)
    );
  }

}
