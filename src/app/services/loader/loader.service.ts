import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loader = new BehaviorSubject<boolean>(false);
  public loaderObs$ = this.loader.asObservable();

  constructor() {
  }

  show() {
    this.loader.next(true);
  }

  hide() {
    this.loader.next(false);
  }
}
