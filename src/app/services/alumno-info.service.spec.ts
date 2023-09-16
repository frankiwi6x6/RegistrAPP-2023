import { TestBed } from '@angular/core/testing';

import { AlumnoInfoService } from './alumno-info.service';

describe('AlumnoInfoService', () => {
  let service: AlumnoInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlumnoInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
