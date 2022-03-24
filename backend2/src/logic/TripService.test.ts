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
      content: 'test-content',
      date: 'test-date',
      region: 'test-region',
      meetTime: '10:00',
      meetPlace: 'test-meet-place',
      dismissTime: '12:00',
      dismissPlace: 'test-dismiss-place',
      fee: 1,
      other: 'test-other',
      ownerName: 'test-owner-name',
      ownerPhone: 'test-owner-phone',
      ownerLine: 'test-owner-line',
      status: 'pending',
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
    mockDbService.getItems = jest.fn(() => [dummyTrip]);

    tripService = bindings.get<TripService>(TripService);
  });

  describe('registerTrip', () => {
    it('should work', async () => {
      await tripService.registerTrip({} as PostTripsRequest);
      expect(mockDbService.createItem).toBeCalledTimes(1);
    });
  });

  describe('getSimplifiedTrips', () => {
    it('should work', async () => {
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
  });

  describe('signTrip', () => {
    it('should work for parent', async () => {
      await tripService.signTrip('id', {
        name: 'a',
        phone: 'b',
        line: 'c',
        yearOfBirth: 'd',
        forWho: 'kid',
        accompany: 'yes',
      });
      expect(mockDbService.getItem).toBeCalledTimes(1);
      expect(mockDbService.putItem).toBeCalledTimes(1);
    });

    it('should work for participant', async () => {
      await tripService.signTrip('id', {
        name: 'a',
        phone: 'b',
        line: 'c',
        yearOfBirth: 'd',
        forWho: 'self',
      });
      expect(mockDbService.getItem).toBeCalledTimes(1);
      expect(mockDbService.putItem).toBeCalledTimes(1);
    });

    it('should fail conditionally', async () => {
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

  describe('getTripForAttendee', () => {
    it('should work', async () => {
      expect(await tripService.getTripForAttendee('id')).toStrictEqual({
        id: 'test-id',
        topic: 'test-topic',
        content: 'test-content',
        date: 'test-date',
        meetTime: '10:00',
        meetPlace: 'test-meet-place',
        dismissTime: '12:00',
        dismissPlace: 'test-dismiss-place',
        fee: 1,
        other: 'test-other',
        dateCreated: 2,
        dateUpdated: 3,
      });
    });
  });

  describe('getDetailedTrips', () => {
    it('should work', async () => {
      expect(await tripService.getDetailedTrips()).toStrictEqual([dummyTrip]);
    });
  });
});
