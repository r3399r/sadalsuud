import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TripService } from 'src/app/services/trip.service';

describe('TripService', () => {
  let service: TripService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let dummyResult: any;

  beforeAll(() => {
    dummyResult = { a: 1, b: 2 };
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
    httpClientSpy.get.and.returnValue(of(dummyResult));
    expect(await service.getTrips()).toBe(dummyResult);
  });

  it('getTrip() should work', async () => {
    httpClientSpy.get.and.returnValue(of(dummyResult));
    expect(await service.getTrip('testId')).toBe(dummyResult);
  });

  it('signTrip() should work', async () => {
    httpClientSpy.post.and.returnValue(of(dummyResult));
    expect(await service.signTrip('testId', 'testId2')).toBe(dummyResult);
  });
});
