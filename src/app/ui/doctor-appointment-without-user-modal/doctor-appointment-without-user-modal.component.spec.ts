import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAppointmentWithoutUserModalComponent } from './doctor-appointment-without-user-modal.component';

describe('DoctorAppointmentWithoutUserModalComponent', () => {
  let component: DoctorAppointmentWithoutUserModalComponent;
  let fixture: ComponentFixture<DoctorAppointmentWithoutUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorAppointmentWithoutUserModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorAppointmentWithoutUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
