import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {
  private currentDate: number[] = [];
  private selectedDate: number[] = [];

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

  isCurrentDay(date: string): boolean {
    this.setCurrentDateAndSelectedDate(date);
    return this.currentDate[0] === this.selectedDate[0] && this.currentDate[1] === this.selectedDate[1] && this.currentDate[2] === this.selectedDate[2];
  }

  setCurrentDateAndSelectedDate(selectedDate: string): void {
    this.currentDate = this.getDateFormat(new Date())
      .split('/')
      .map((elem) => {
        return parseInt(elem);
      });

    this.selectedDate = selectedDate.split('/').map((elem) => {
      return parseInt(elem);
    });
  }

  isSelectedDateGreaterOrEqualComparedToCurrentDate(date: string): boolean {
    this.setCurrentDateAndSelectedDate(date);
    if (this.selectedDate[2] === this.currentDate[2] && this.selectedDate[0] === this.currentDate[0] && this.selectedDate[1] >= this.currentDate[1]) {
      return true;
    } else if (this.selectedDate[2] === this.currentDate[2] && this.selectedDate[0] >= this.currentDate[0]) {
      return true;
    } else return this.selectedDate[2] >= this.currentDate[2];
  }

  getDateFromOneMonthAgo(): any {
    const date = new Date();
    date.setHours(0, 0);
    date.setMonth(date.getMonth() - 1);
    return date.getTime();
  }

  getDateFormat(date: Date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return month + '/' + day + '/' + year;
  }

  setAndGetDateToFetch(): any {
    const today = new Date();
    const tomorrow = new Date();
    today.setHours(0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0);

    return {
      today: today.getTime(),
      tomorrow: tomorrow.getTime()
    }
  }

}
