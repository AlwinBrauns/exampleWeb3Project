import { TestBed } from '@angular/core/testing';

import { Web3conService } from './web3con.service';

describe('Web3conService', () => {
  let service: Web3conService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Web3conService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
