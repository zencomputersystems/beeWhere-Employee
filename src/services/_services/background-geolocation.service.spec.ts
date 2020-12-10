import { TestBed } from '@angular/core/testing';

import { BackgroundGeolocationService } from './background-geolocation.service';

describe('BackgroundGeolocationService', () => {
  let service: BackgroundGeolocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundGeolocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
