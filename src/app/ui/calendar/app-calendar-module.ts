import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {CalendarComponent} from "./calendar.component";

@NgModule({
  imports: [
    CommonModule,
    CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory})
  ],
  exports: [CalendarComponent],
  declarations: [CalendarComponent]
})
export class AppCalendarModule { }
