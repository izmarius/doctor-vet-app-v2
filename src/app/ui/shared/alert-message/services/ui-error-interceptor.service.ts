import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export interface IAlerts {
  message: string;
  class: string;
}

@Injectable({
  providedIn: 'root'
})
export class UiErrorInterceptorService {

  // todo: create a codee and error msg?
  private uiErrorSubject: BehaviorSubject<IAlerts>;
  public uiError: Observable<IAlerts>;

  constructor() {
    // @ts-ignore
    this.uiErrorSubject = new BehaviorSubject<IAlerts>(null);
    this.uiError = this.uiErrorSubject.asObservable();
  }

  setUiError(alert: IAlerts): void {
    this.uiErrorSubject.next(alert);
  }
}
