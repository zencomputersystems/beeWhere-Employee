import { TestBed } from '@angular/core/testing';

import { FakeGpsService } from './fake-gps.service';

describe('FakeGpsService', () => {
  let service: FakeGpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FakeGpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
