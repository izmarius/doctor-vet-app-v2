import {Injectable} from '@angular/core';
import {AngularFireFunctions} from "@angular/fire/functions";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(private functions: AngularFireFunctions) {
  }

  sendSMSNotification(phoneNumber: string): void {
    const sendSMSNotification = this.functions.httpsCallable('sendSMSNotification');
    sendSMSNotification({phoneNumber: '+40743922689'})
      .pipe(take(1))
      .subscribe((res: any) => {
        console.log(res);
      });
  }
}
