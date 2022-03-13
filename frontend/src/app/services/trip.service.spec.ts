import { TestBed } from '@angular/core/testing';
import { GetTripsResponse, PostTripRequest, SignTripRequest } from '@y-celestial/sadalsuud-service';
import { HttpClientService } from './http-client.service';

import { TripService } from './trip.service';
import { UserService } from './user.service';

describe('TripService', () => {
  let service: TripService;
  let httpClientSpy: jasmine.SpyObj<HttpClientService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClientService', ['get', 'post', 'put']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['refreshUser']);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClientService, useValue: httpClientSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    });
    service = TestBed.inject(TripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getVerfiedTrips should work', async () => {
    httpClientSpy.get.and.resolveTo([
      { id: '1', verified: true },
      { id: '2', verified: false },
    ]);
    expect(await service.getVerfiedTrips()).toEqual([
      { id: '1', verified: true },
    ] as GetTripsResponse);
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('getUnverifiedTrips should work', async () => {
    httpClientSpy.get.and.resolveTo([
      { id: 1, verified: true },
      { id: '2', verified: false },
    ]);
    expect(await service.getUnverifiedTrips()).toEqual([
      { id: '2', verified: false },
    ] as GetTripsResponse);
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('createTrip should work', async () => {
    await service.createTrip({} as PostTripRequest);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });

  it('editTrip should work', async () => {
    await service.editTrip('id', {} as PostTripRequest);
    expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
  });

  it('getTrip should work', async () => {
    await service.getTrip('test-id');
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('signTrip should work', async () => {
    await service.signTrip('test-id', {} as SignTripRequest);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    expect(userServiceSpy.refreshUser).toHaveBeenCalledTimes(1);
  });

  it('signTrip should throw if somthing wrong', async () => {
    userServiceSpy.refreshUser.and.rejectWith('no');
    await expectAsync(service.signTrip('test-id', {} as SignTripRequest)).toBeRejectedWithError(
      'no',
    );

    userServiceSpy.refreshUser.and.rejectWith(
      new Error('You have already signed this trip before.'),
    );
    await expectAsync(service.signTrip('test-id', {} as SignTripRequest)).toBeRejectedWithError(
      '您已報名過了',
    );
  });
});
