import { TestBed } from '@angular/core/testing';

import { SeccionInfoService } from './seccion-info.service';

describe('SeccionInfoService', () => {
  let service: SeccionInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeccionInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
