import {Injectable} from '@angular/core';
import {AngularFireFunctions} from "@angular/fire/functions";

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(private functions: AngularFireFunctions) {
  }

  sendSMSNotification(phoneNumber: string): void {
    const sendSMSNotification = this.functions.httpsCallable('sendSMSNotification');
    sendSMSNotification({phoneNumber: '+40743922689'})
      .subscribe((res: any) => {
        console.log(res);
      });
  }
}
