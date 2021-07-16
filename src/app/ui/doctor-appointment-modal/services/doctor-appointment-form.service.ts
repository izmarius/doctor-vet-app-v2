import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {UserService} from "../../user-profile/services/user.service";
import {UserDTO} from "../../user-profile/dto/user-dto";

@Injectable({
  providedIn: 'root',
})
export class DoctorAppointmentFormService {

  constructor(private userService: UserService) { }

  // @ts-ignore
  filterPatients(searchText: string, patientName: string): Observable<any> {
    searchText = patientName;
    if (patientName.length >= 2) {
      return this.userService.getAllUsers().pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map((usersList: UserDTO[]) => {
          return usersList.filter(
            (user) =>
              user['name'].toLowerCase().indexOf(searchText.toLowerCase()) > -1
          );
        })
      );
    }
  }

}
