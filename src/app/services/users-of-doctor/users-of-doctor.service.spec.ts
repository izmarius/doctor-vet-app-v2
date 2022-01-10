import { TestBed } from '@angular/core/testing';

import { UsersOfDoctorService } from './users-of-doctor.service';

describe('UsersOfDoctorService', () => {
  let service: UsersOfDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersOfDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
