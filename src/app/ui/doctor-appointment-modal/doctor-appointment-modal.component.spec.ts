import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAppointmentModalComponent } from './doctor-appointment-modal.component';

describe('DoctorAppointmentModalComponent', () => {
  let component: DoctorAppointmentModalComponent;
  let fixture: ComponentFixture<DoctorAppointmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorAppointmentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorAppointmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
