import {debounceTime, distinctUntilChanged, map, take} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserService} from "../../user-profile/services/user.service";
import {UserDTO} from "../../user-profile/dto/user-dto";

@Injectable({
  providedIn: 'root',
})
export class DoctorAppointmentFormService {

  constructor(private userService: UserService) {
  }
  // todo move from here?
  saveAnimal(user: any, animalName: string, animalDocUID: string): void {
    this.userService.saveAnimal(user, animalName, animalDocUID);
  }

  // @ts-ignore
  filterClients(searchText: string): Observable<any> {
    if (searchText.length > 2) {
      // todo : change to where clause and change filtering by email
      return this.userService.getAllUsers()
        .pipe(
          debounceTime(200),
          distinctUntilChanged(),
          map((usersList: UserDTO[]) => {
            return usersList.filter(
              (user) =>
                user['name'].toLowerCase().indexOf(searchText.toLowerCase()) > -1
            );
          }),
          take(1)
        );
    }
  }

}
