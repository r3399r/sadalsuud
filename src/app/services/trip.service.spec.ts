import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TripService } from 'src/app/services/trip.service';

describe('TripService', () => {
  let service: TripService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let dummyTrips: any;
  let dummyStar: any;

  beforeAll(() => {
    dummyTrips = [
      {
        creationId: 'testId1',
        startDate: new Date(
          new Date().valueOf() - 3000 * 3600 * 24
        ).toISOString(),
        endDate: new Date(
          new Date().valueOf() - 3000 * 3600 * 24
        ).toISOString(),
        expiredDate: new Date(
          new Date().valueOf() - 1000 * 3600 * 24
        ).toISOString(),
      },
      {
        creationId: 'testId2',
        startDate: new Date(
          new Date().valueOf() + 1000 * 3600 * 24
        ).toISOString(),
        endDate: new Date(
          new Date().valueOf() + 1000 * 3600 * 24
        ).toISOString(),
        expiredDate: new Date(
          new Date().valueOf() + 2000 * 3600 * 24
        ).toISOString(),
      },
    ];
    dummyStar = {
      creationId: 'starId',
      name: 'testName',
    };
  });

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    httpClientSpy.get.and.returnValue(of(dummyTrips));

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
    });
    service = TestBed.inject(TripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTrips() should work', async () => {
    await service.getTrips();
    expect(await service.getTrips()).toEqual([dummyTrips[1]]);
  });

  it('getTrip() should work', async () => {
    await service.getTrip('testId1');
    expect(await service.getTrip('testId1')).toEqual(dummyTrips[0]);
  });

  it('signTrip() should work', async () => {
    httpClientSpy.post.and.returnValue(of('result'));
    expect(await service.signTrip('testId', dummyStar)).toBe(
      `${dummyStar.name} 報名成功！將於截止後進行抽籤`
    );
  });

  it('signTrip() should return already sign when duplicated', async () => {
    httpClientSpy.post.and.returnValue(
      throwError({ error: { message: 'already signed' } })
    );
    expect(await service.signTrip('testId', dummyStar)).toBe(
      `${dummyStar.name} 已經報名成功囉！將於截止後進行抽籤`
    );
  });

  it('signTrip() should return internal error whe unknown error occurs', async () => {
    httpClientSpy.post.and.returnValue(
      throwError({ error: { message: 'unknown' } })
    );
    expect(await service.signTrip('testId', dummyStar)).toBe(
      '報名失敗，發生未知錯誤，請聯繫星遊官方帳號'
    );
  });
});
