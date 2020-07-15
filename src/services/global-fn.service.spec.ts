import { TestBed } from '@angular/core/testing';

import { GlobalFnService } from './global-fn.service';

describe('GlobalFnService', () => {
  let service: GlobalFnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalFnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
