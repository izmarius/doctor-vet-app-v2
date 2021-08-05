import { TestBed } from '@angular/core/testing';

import { UiErrorInterceptorService } from './ui-error-interceptor.service';

describe('UiErrorInterceptorService', () => {
  let service: UiErrorInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiErrorInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
