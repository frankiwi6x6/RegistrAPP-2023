import { TestBed } from '@angular/core/testing';

import { AlertControllerService } from './alert-controller.service';

describe('AlertControllerService', () => {
  let service: AlertControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
