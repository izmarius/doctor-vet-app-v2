import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersDoctorsListService {

  private usersDoctorsList = new BehaviorSubject<any>(null);
  public usersDoctorsListObs$ = this.usersDoctorsList.asObservable();

  constructor() {
  }

  setUsersDoctorList(listOfUsersDoctors: any) {
    this.usersDoctorsList.next(listOfUsersDoctors);
  }
}
