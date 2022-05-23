import { InternalServerError, UnauthorizedError } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { Status } from 'src/constant/Trip';
import { PostTripsRequest } from 'src/model/api/Trip';
import { Sign, SignModel } from 'src/model/entity/Sign';
import { Trip, TripModel } from 'src/model/entity/Trip';
import { TripService } from './TripService';

/**
 * Tests of the TripService class.
 */
describe('TripService', () => {
  let tripService: TripService;
  let mockTripModel: any;
  let mockSignModel: any;
  let dummyTrip: Trip;
  let dummyTripWithSign: Trip;
  let dummySign: Sign;

  beforeAll(() => {
    dummyTrip = {
      id: 'test-id',
      topic: 'test-topic',
      ad: 'test-ad',
      content: 'test-content',
      date: '2022-01-01',
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
      status: Status.Pass,
      dateCreated: 2,
      dateUpdated: 3,
    };
    dummyTripWithSign = {
      ...dummyTrip,
      signId: ['sign-id', 'sign-id2'],
    };
    dummySign = {
      id: 'sign-id',
      name: 'test-name',
      phone: 'test-phone',
      yearOfBirth: 'test-year',
      isSelf: true,
      status: 'pending',
      dateCreated: 1,
      dateUpdated: 2,
    };
  });

  beforeEach(() => {
    mockTripModel = {};
    mockSignModel = {};
    bindings.rebind<TripModel>(TripModel).toConstantValue(mockTripModel);
    bindings.rebind<SignModel>(SignModel).toConstantValue(mockSignModel);

    mockTripModel.create = jest.fn();
    mockTripModel.replace = jest.fn();
    mockTripModel.find = jest.fn(() => dummyTrip);
    mockTripModel.findAll = jest.fn(() => [dummyTrip, dummyTripWithSign]);
    mockTripModel.hardDelete = jest.fn();
    mockSignModel.create = jest.fn();
    mockSignModel.find = jest.fn(() => dummySign);
    mockSignModel.replace = jest.fn();
    mockSignModel.hardDelete = jest.fn();

    tripService = bindings.get<TripService>(TripService);
  });

  describe('registerTrip', () => {
    it('should work', async () => {
      await tripService.registerTrip({} as PostTripsRequest);
      expect(mockTripModel.create).toBeCalledTimes(1);
    });
  });

  describe('getSimplifiedTrips', () => {
    it('should work', async () => {
      const result = {
        id: 'test-id',
        topic: 'test-topic',
        ad: 'test-ad',
        date: '2022-01-01',
        meetTime: '10:00',
        dismissTime: '12:00',
        region: 'test-region',
        fee: 1,
        other: 'test-other',
        status: Status.Pass,
        ownerName: 'test-owner-name',
        notifyDate: undefined,
        expiredDate: undefined,
        dateCreated: 2,
        dateUpdated: 3,
      };
      mockTripModel.findAll = jest.fn(() => [dummyTrip]);
      expect(await tripService.getSimplifiedTrips()).toStrictEqual([result]);
    });

    it('should work if status is pending', async () => {
      const result = {
        id: 'test-id',
        topic: 'test-topic',
        date: '2022-01-01',
        status: Status.Pending,
        ownerName: 'test-owner-name',
        dateCreated: 2,
        dateUpdated: 3,
      };
      mockTripModel.findAll = jest.fn(() => [
        { ...dummyTrip, status: Status.Pending },
      ]);
      expect(await tripService.getSimplifiedTrips()).toStrictEqual([result]);
    });

    it('should work if status is reject', async () => {
      const result = {
        id: 'test-id',
        topic: 'test-topic',
        date: '2022-01-01',
        status: Status.Reject,
        ownerName: 'test-owner-name',
        reason: undefined,
        dateCreated: 2,
        dateUpdated: 3,
      };
      mockTripModel.findAll = jest.fn(() => [
        { ...dummyTrip, status: Status.Reject },
      ]);
      expect(await tripService.getSimplifiedTrips()).toStrictEqual([result]);
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
      expect(mockSignModel.create).toBeCalledTimes(1);
      expect(mockTripModel.find).toBeCalledTimes(1);
      expect(mockTripModel.replace).toBeCalledTimes(1);
    });

    it('should work for participant', async () => {
      await tripService.signTrip('id', {
        name: 'a',
        phone: 'b',
        line: 'c',
        yearOfBirth: 'd',
        forWho: 'self',
      });
      expect(mockSignModel.create).toBeCalledTimes(1);
      expect(mockTripModel.find).toBeCalledTimes(1);
      expect(mockTripModel.replace).toBeCalledTimes(1);
    });

    it('should work for second sign', async () => {
      mockTripModel.find = jest.fn().mockResolvedValue(dummyTripWithSign);
      await tripService.signTrip('id', {
        name: 'a',
        phone: 'b',
        line: 'c',
        yearOfBirth: 'd',
        forWho: 'self',
      });
      expect(mockSignModel.create).toBeCalledTimes(1);
      expect(mockTripModel.find).toBeCalledTimes(1);
      expect(mockTripModel.replace).toBeCalledTimes(1);
    });
  });

  describe('getDetailedTrip', () => {
    it('should work', async () => {
      expect(await tripService.getDetailedTrip('id')).toStrictEqual({
        id: 'test-id',
        topic: 'test-topic',
        ad: 'test-ad',
        content: 'test-content',
        date: '2022-01-01',
        region: 'test-region',
        meetTime: '10:00',
        meetPlace: 'test-meet-place',
        dismissTime: '12:00',
        dismissPlace: 'test-dismiss-place',
        fee: 1,
        other: 'test-other',
        ownerName: 'test-owner-name',
        status: Status.Pass,
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
          date: '2022-01-01',
          ownerName: 'test-owner-name',
          ownerPhone: 'test-owner-phone',
          ownerLine: 'test-owner-line',
          code: '123456',
          status: Status.Pass,
          signs: 0,
          dateCreated: 2,
          dateUpdated: 3,
        },
        {
          id: 'test-id',
          topic: 'test-topic',
          date: '2022-01-01',
          ownerName: 'test-owner-name',
          ownerPhone: 'test-owner-phone',
          ownerLine: 'test-owner-line',
          code: '123456',
          status: Status.Pass,
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
      expect(mockTripModel.find).toBeCalledTimes(1);
      expect(mockTripModel.hardDelete).toBeCalledTimes(1);
      expect(mockSignModel.hardDelete).toBeCalledTimes(0);
    });

    it('should work with sign', async () => {
      mockTripModel.find = jest.fn().mockResolvedValue(dummyTripWithSign);
      await tripService.deleteTripById('id');
      expect(mockTripModel.find).toBeCalledTimes(1);
      expect(mockTripModel.hardDelete).toBeCalledTimes(1);
      expect(mockSignModel.hardDelete).toBeCalledTimes(2);
    });

    it('should fail', async () => {
      mockTripModel.hardDelete = jest.fn().mockRejectedValue('');
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
      expect(mockTripModel.find).toBeCalledTimes(1);
      expect(mockTripModel.replace).toBeCalledTimes(1);
    });

    it('should work for reject', async () => {
      await tripService.verifyTrip('id', { pass: 'no', reason: 'abc' });
      expect(mockTripModel.find).toBeCalledTimes(1);
      expect(mockTripModel.replace).toBeCalledTimes(1);
    });
  });

  describe('getSigns', () => {
    it('should work with empty sign', async () => {
      expect(await tripService.getSigns('id', '123456')).toStrictEqual([]);
      expect(mockTripModel.find).toBeCalledTimes(1);
      expect(mockSignModel.find).toBeCalledTimes(0);
    });

    it('should work with sign', async () => {
      mockTripModel.find = jest.fn().mockResolvedValue(dummyTripWithSign);
      await tripService.getSigns('id', '123456');
      expect(mockTripModel.find).toBeCalledTimes(1);
      expect(mockSignModel.find).toBeCalledTimes(2);
    });

    it('should fail', async () => {
      await expect(() => tripService.getSigns('id', 'xxxxx')).rejects.toThrow(
        UnauthorizedError
      );
      expect(mockTripModel.find).toBeCalledTimes(1);
    });
  });

  describe('reviseMember', () => {
    it('should work', async () => {
      await tripService.reviseMember('id', { signId: ['123456'] });
      expect(mockTripModel.find).toBeCalledTimes(1);
      expect(mockSignModel.find).toBeCalledTimes(0);
    });

    it('should work with sign', async () => {
      mockTripModel.find = jest.fn().mockResolvedValue(dummyTripWithSign);
      await tripService.reviseMember('id', { signId: ['sign-id'] });
      expect(mockTripModel.find).toBeCalledTimes(1);
      expect(mockSignModel.find).toBeCalledTimes(2);
    });
  });
});
