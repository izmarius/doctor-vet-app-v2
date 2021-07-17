import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

  constructor() {
  }

  formatTime(hour: number | string, minute: number | string): string {
    if (minute <= 9) {
      minute = '0' + minute;
    }
    if (hour <= 9) {
      hour = '0' + hour;
    }
    return hour + ':' + minute;
  }

}
