import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

constructor() { }

formatDateAndTime(date: any, time: any): string {
  let minute = time.minute;
  let hour = time.hour;
  let month = date.month;
  let day = date.day;
  if (minute <= 9) {
    minute = '0'.concat(minute);
  }
  if (hour <= 9) {
    hour = '0'.concat(hour);
  }
  if (month <= 9) {
    month = '0'.concat(month);
  }
  if (day <= 9) {
    day = '0'.concat(day);
  }
  return (
    date.year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + '0' + time.second
  );
}

}
