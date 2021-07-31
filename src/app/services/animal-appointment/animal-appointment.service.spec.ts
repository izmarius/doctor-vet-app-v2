import { TestBed } from '@angular/core/testing';

import { AnimalAppointmentService } from './animal-appointment.service';

describe('AnimalAppointmentService', () => {
  let service: AnimalAppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimalAppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
