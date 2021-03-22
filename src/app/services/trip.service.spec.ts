import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TripService } from 'src/app/services/trip.service';

describe('TripService', () => {
  let service: TripService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let dummyTrips: any;

  beforeAll(() => {
    dummyTrips = [
      {
        expiredDate: new Date(
          new Date().valueOf() - 1000 * 3600 * 24
        ).toISOString(),
      },
      {
        expiredDate: new Date(
          new Date().valueOf() + 1000 * 3600 * 24
        ).toISOString(),
      },
    ];
  });

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
    });
    service = TestBed.inject(TripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTrips() should work', async () => {
    httpClientSpy.get.and.returnValue(of(dummyTrips));
    expect(await service.getTrips()).toEqual([dummyTrips[1]]);
  });

  it('getTrip() should work', async () => {
    httpClientSpy.get.and.returnValue(of(dummyTrips[0]));
    expect(await service.getTrip('testId')).toEqual(dummyTrips[0]);
  });

  it('signTrip() should work', async () => {
    httpClientSpy.post.and.returnValue(of('result'));
    expect(await service.signTrip('testId', 'testId2')).toBe('result');
  });
});
