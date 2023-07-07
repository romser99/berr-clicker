import { TestBed } from '@angular/core/testing';

import { BeerMultiplierService } from './beer-multiplier.service';

describe('BeerMultiplierServiceService', () => {
  let service: BeerMultiplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeerMultiplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
