import { TestBed } from '@angular/core/testing';

import { UserAppointmentsService } from './user-appointments.service';

describe('UserAppointmentsService', () => {
  let service: UserAppointmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAppointmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
