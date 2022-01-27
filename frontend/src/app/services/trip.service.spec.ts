import { TestBed } from '@angular/core/testing';
import { HttpClientService } from './http-client.service';

import { TripService } from './trip.service';

describe('TripService', () => {
  let service: TripService;
  let httpClientSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClientService', ['get']);

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClientService, useValue: httpClientSpy }],
    });
    service = TestBed.inject(TripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
