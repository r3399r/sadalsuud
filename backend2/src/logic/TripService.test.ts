import { BadRequestError, DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { PostTripsRequest } from 'src/model/api/Trip';
import { TripService } from './TripService';

/**
 * Tests of the TripService class.
 */
describe('TripService', () => {
  let tripService: TripService;
  let mockDbService: any;
  let dummyTrip: any;

  beforeAll(() => {
    dummyTrip = {
      id: 'test-id',
      topic: 'test-topic',
      ad: 'test-ad',
      date: 'test-date',
      meetTime: '10:00',
      dismissTime: '12:00',
      region: 'test-region',
      fee: 1,
      other: 'test-other',
      sign: [],
      dateCreated: 2,
      dateUpdated: 3,
    };
  });

  beforeEach(() => {
    mockDbService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    mockDbService.createItem = jest.fn();
    mockDbService.putItem = jest.fn();
    mockDbService.getItem = jest.fn(() => dummyTrip);

    tripService = bindings.get<TripService>(TripService);
  });

  it('registerTrip should work', async () => {
    await tripService.registerTrip({} as PostTripsRequest);
    expect(mockDbService.createItem).toBeCalledTimes(1);
  });

  it('getSimplifiedTrips should work', async () => {
    const result = {
      id: 'test-id',
      topic: 'test-topic',
      ad: 'test-ad',
      date: 'test-date',
      period: 'daytime',
      region: 'test-region',
      fee: 1,
      other: 'test-other',
      dateCreated: 2,
      dateUpdated: 3,
    };
    mockDbService.getItems = jest.fn(() => [dummyTrip]);
    expect(await tripService.getSimplifiedTrips()).toStrictEqual([result]);
    mockDbService.getItems = jest.fn(() => [
      { ...dummyTrip, dismissTime: '11:00' },
    ]);
    expect(await tripService.getSimplifiedTrips()).toStrictEqual([
      { ...result, period: 'morning' },
    ]);
    mockDbService.getItems = jest.fn(() => [
      { ...dummyTrip, dismissTime: '20:00' },
    ]);
    expect(await tripService.getSimplifiedTrips()).toStrictEqual([
      { ...result, period: 'allday' },
    ]);
    mockDbService.getItems = jest.fn(() => [
      { ...dummyTrip, meetTime: '13:00', dismissTime: '14:00' },
    ]);
    expect(await tripService.getSimplifiedTrips()).toStrictEqual([
      { ...result, period: 'afternoon' },
    ]);
    mockDbService.getItems = jest.fn(() => [
      { ...dummyTrip, meetTime: '13:00', dismissTime: '20:00' },
    ]);
    expect(await tripService.getSimplifiedTrips()).toStrictEqual([
      { ...result, period: 'pm' },
    ]);
    mockDbService.getItems = jest.fn(() => [
      { ...dummyTrip, meetTime: '19:00', dismissTime: '20:00' },
    ]);
    expect(await tripService.getSimplifiedTrips()).toStrictEqual([
      { ...result, period: 'evening' },
    ]);
  });

  it('signTrip should work', async () => {
    await tripService.signTrip('id', {
      name: 'a',
      phone: 'b',
      line: 'c',
      yearOfBirth: 'd',
      forWho: 'kid',
      accompany: true,
    });
    expect(mockDbService.getItem).toBeCalledTimes(1);
    expect(mockDbService.putItem).toBeCalledTimes(1);
  });

  it('signTrip should fail confitionally', async () => {
    await expect(
      tripService.signTrip('id', {
        name: 'a',
        phone: 'b',
        line: 'c',
        yearOfBirth: 'd',
        forWho: 'kid',
      })
    ).rejects.toThrow(BadRequestError);
  });
});
