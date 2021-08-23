import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAppointmentDialogComponent } from './user-appointment.component';

describe('UserAppointmentComponent', () => {
  let component: UserAppointmentDialogComponent;
  let fixture: ComponentFixture<UserAppointmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAppointmentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
