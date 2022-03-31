import {
  DbService,
  InternalServerError,
  UnauthorizedError,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { PostTripsRequest } from 'src/model/api/Trip';
import { Trip } from 'src/model/entity/Trip';
import { TripService } from './TripService';

/**
 * Tests of the TripService class.
 */
describe('TripService', () => {
  let tripService: TripService;
  let mockDbService: any;
  let dummyTrip: Trip;
  let dummyTripWithSign: Trip;

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
      code: '123456',
      status: 'pending',
      dateCreated: 2,
      dateUpdated: 3,
    };
    dummyTripWithSign = {
      ...dummyTrip,
      signId: ['sign-id', 'sign-id2'],
    };
  });

  beforeEach(() => {
    mockDbService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    mockDbService.createItem = jest.fn();
    mockDbService.putItem = jest.fn();
    mockDbService.getItem = jest.fn(() => dummyTrip);
    mockDbService.getItems = jest.fn(() => [dummyTrip, dummyTripWithSign]);
    mockDbService.deleteItem = jest.fn();

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

    it('should work for second sign', async () => {
      mockDbService.getItem = jest.fn().mockResolvedValue(dummyTripWithSign);
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
      expect(await tripService.getDetailedTrips()).toStrictEqual([
        {
          id: 'test-id',
          topic: 'test-topic',
          date: 'test-date',
          ownerName: 'test-owner-name',
          ownerPhone: 'test-owner-phone',
          ownerLine: 'test-owner-line',
          code: '123456',
          status: 'pending',
          signs: 0,
          dateCreated: 2,
          dateUpdated: 3,
        },
        {
          id: 'test-id',
          topic: 'test-topic',
          date: 'test-date',
          ownerName: 'test-owner-name',
          ownerPhone: 'test-owner-phone',
          ownerLine: 'test-owner-line',
          code: '123456',
          status: 'pending',
          signs: 2,
          dateCreated: 2,
          dateUpdated: 3,
        },
      ]);
    });
  });

  describe('deleteTripById', () => {
    it('should work without sign', async () => {
      await tripService.deleteTripById('id');
      expect(mockDbService.getItem).toBeCalledTimes(1);
      expect(mockDbService.deleteItem).toBeCalledTimes(1);
    });

    it('should work with sign', async () => {
      mockDbService.getItem = jest.fn().mockResolvedValue(dummyTripWithSign);
      await tripService.deleteTripById('id');
      expect(mockDbService.getItem).toBeCalledTimes(1);
      expect(mockDbService.deleteItem).toBeCalledTimes(3);
    });

    it('should fail', async () => {
      mockDbService.deleteItem = jest.fn().mockRejectedValue('');
      await expect(() => tripService.deleteTripById('id')).rejects.toThrow(
        InternalServerError
      );
    });
  });

  describe('verifyTrip', () => {
    it('should work for pass', async () => {
      await tripService.verifyTrip('id', {
        pass: 'yes',
        expiredDate: '1234',
        notifyDate: '2345',
      });
      expect(mockDbService.getItem).toBeCalledTimes(1);
      expect(mockDbService.putItem).toBeCalledTimes(1);
    });

    it('should work for reject', async () => {
      await tripService.verifyTrip('id', { pass: 'no', reason: 'abc' });
      expect(mockDbService.getItem).toBeCalledTimes(1);
      expect(mockDbService.putItem).toBeCalledTimes(1);
    });
  });

  describe('getSigns', () => {
    it('should work with empty sign', async () => {
      expect(await tripService.getSigns('id', '123456')).toStrictEqual([]);
      expect(mockDbService.getItem).toBeCalledTimes(1);
    });

    it('should work with sign', async () => {
      mockDbService.getItem = jest.fn().mockResolvedValue(dummyTripWithSign);
      await tripService.getSigns('id', '123456');
      expect(mockDbService.getItem).toBeCalledTimes(3);
    });

    it('should fail', async () => {
      await expect(() => tripService.getSigns('id', 'xxxxx')).rejects.toThrow(
        UnauthorizedError
      );
      expect(mockDbService.getItem).toBeCalledTimes(1);
    });
  });

  describe('reviseMember', () => {
    it('should work', async () => {
      await tripService.reviseMember('id', { signId: ['123456'] });
      expect(mockDbService.getItem).toBeCalledTimes(1);
    });

    it('should work with sign', async () => {
      mockDbService.getItem = jest.fn().mockResolvedValue(dummyTripWithSign);
      await tripService.reviseMember('id', { signId: ['sign-id'] });
      expect(mockDbService.getItem).toBeCalledTimes(3);
    });

    // it('should fail', async () => {
    //   await expect(() => tripService.getSigns('id', 'xxxxx')).rejects.toThrow(
    //     UnauthorizedError
    //   );
    //   expect(mockDbService.getItem).toBeCalledTimes(1);
    // });
  });
});
