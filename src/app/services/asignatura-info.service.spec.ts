import { TestBed } from '@angular/core/testing';

import { AsignaturaInfoService } from './asignatura-info.service';

describe('AsignaturaInfoService', () => {
  let service: AsignaturaInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsignaturaInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
