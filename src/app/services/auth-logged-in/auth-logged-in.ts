import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthLoggedInServiceService {
  private userLoggedIn: BehaviorSubject<any>;
  public userLoggedInObs: Observable<any>;
  constructor() {
    this.userLoggedIn = new BehaviorSubject<any>(null);
    this.userLoggedInObs = this.userLoggedIn.asObservable();
  }
  setLoggedInUser(user: any): void {
    this.userLoggedIn.next(user);
  }


}
