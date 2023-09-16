import { TestBed } from '@angular/core/testing';

import { ProfesorInfoService } from './profesor-info.service';

describe('ProfesorInfoService', () => {
  let service: ProfesorInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfesorInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
