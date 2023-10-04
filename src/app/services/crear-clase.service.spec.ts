import { TestBed } from '@angular/core/testing';

import { CrearClaseService } from './crear-clase.service';

describe('CrearClaseService', () => {
  let service: CrearClaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearClaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
