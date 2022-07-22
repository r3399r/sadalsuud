import { UnauthorizedError } from '@y-celestial/service';
import { SignAccess } from 'src/access/SignAccess';
import { TripAccess } from 'src/access/TripAccess';
import { bindings } from 'src/bindings';
import { Status } from 'src/constant/Trip';
import { PostTripsRequest } from 'src/model/api/Trip';
import { Sign } from 'src/model/entity/Sign';
import { Trip } from 'src/model/entity/Trip';
import { TripService } from './TripService';

/**
 * Tests of the TripService class.
 */
describe('TripService', () => {
  let tripService: TripService;
  let mockTripAccess: any;
  let mockSignAccess: any;
  let dummyTrip: Trip;
  let dummySign: Sign;

  beforeAll(() => {
    dummyTrip = {
      id: 'test-id',
      uuid: 'uuid',
      topic: 'test-topic',
      ad: 'test-ad',
      content: 'test-content',
      region: 'test-region',
      meetDate: new Date('2022/01/01'),
      meetPlace: 'test-meet-place',
      dismissDate: new Date('2022/01/02'),
      dismissPlace: 'test-dismiss-place',
      fee: 1,
      other: 'test-other',
      ownerName: 'test-owner-name',
      ownerPhone: 'test-owner-phone',
      ownerLine: 'test-owner-line',
      expiredDate: null,
      notifyDate: null,
      reason: null,
      code: '123456',
      status: Status.Pass,
      dateCreated: new Date('2021/12/31'),
      dateUpdated: null,
    };
    dummySign = {
      id: 'sign-id',
      name: 'test-name',
      phone: 'test-phone',
      line: null,
      birthYear: 'test-year',
      isSelf: true,
      accompany: null,
      canJoin: true,
      comment: null,
      tripId: 'trip-id',
      dateCreated: new Date('2021/12/31'),
      dateUpdated: null,
    };
  });

  beforeEach(() => {
    mockTripAccess = {};
    mockSignAccess = {};
    bindings.rebind<TripAccess>(TripAccess).toConstantValue(mockTripAccess);
    bindings.rebind<SignAccess>(SignAccess).toConstantValue(mockSignAccess);

    mockTripAccess.save = jest.fn();
    mockTripAccess.findById = jest.fn(() => dummyTrip);
    mockTripAccess.findOne = jest.fn(() => dummyTrip);
    mockTripAccess.findMany = jest.fn(() => [dummyTrip]);
    mockTripAccess.hardDeleteById = jest.fn();
    mockSignAccess.save = jest.fn();
    mockSignAccess.findMany = jest.fn(() => [dummySign]);
    mockSignAccess.hardDeleteById = jest.fn();

    tripService = bindings.get<TripService>(TripService);
  });

  describe('registerTrip', () => {
    it('should work', async () => {
      await tripService.registerTrip({} as PostTripsRequest);
      expect(mockTripAccess.save).toBeCalledTimes(1);
    });
  });

  // describe('getSimplifiedTrips', () => {
  //   it('should work', async () => {
  //     const result = {
  //       id: 'test-id',
  //       topic: 'test-topic',
  //       ad: 'test-ad',
  //       date: '2022/01/01',
  //       meetDate: '2022/01/01 00:00',
  //       dismissDate: '2022/01/02 00:00',
  //       region: 'test-region',
  //       fee: 1,
  //       other: 'test-other',
  //       status: Status.Pass,
  //       ownerName: 'test-owner-name',
  //       notifyDate: null,
  //       expiredDate: null,
  //       dateCreated: '2022/12/31 00:00',
  //       dateUpdated: null,
  //     };
  //     expect(await tripService.getSimplifiedTrips()).toStrictEqual([result]);
  //   });

  //   it('should work if status is pending', async () => {
  //     const result = {
  //       id: 'test-id',
  //       topic: 'test-topic',
  //       date: '2022-01-01',
  //       status: Status.Pending,
  //       ownerName: 'test-owner-name',
  //       dateCreated: 2,
  //       dateUpdated: 3,
  //     };
  //     mockTripAccess.findMany = jest.fn(() => [
  //       { ...dummyTrip, status: Status.Pending },
  //     ]);
  //     expect(await tripService.getSimplifiedTrips()).toStrictEqual([result]);
  //   });

  //   it('should work if status is reject', async () => {
  //     const result = {
  //       id: 'test-id',
  //       topic: 'test-topic',
  //       date: '2022-01-01',
  //       status: Status.Reject,
  //       ownerName: 'test-owner-name',
  //       reason: undefined,
  //       dateCreated: 2,
  //       dateUpdated: 3,
  //     };
  //     mockTripAccess.findAll = jest.fn(() => [
  //       { ...dummyTrip, status: Status.Reject },
  //     ]);
  //     expect(await tripService.getSimplifiedTrips()).toStrictEqual([result]);
  //   });
  // });

  describe('signTrip', () => {
    it('should work for parent', async () => {
      await tripService.signTrip('id', {
        name: 'a',
        phone: 'b',
        line: 'c',
        birthYear: 'd',
        forWho: 'kid',
        accompany: 'yes',
      });
      expect(mockSignAccess.save).toBeCalledTimes(1);
    });

    it('should work for participant', async () => {
      await tripService.signTrip('id', {
        name: 'a',
        phone: 'b',
        line: 'c',
        birthYear: 'd',
        forWho: 'self',
      });
      expect(mockSignAccess.save).toBeCalledTimes(1);
    });
  });

  // describe('getDetailedTrip', () => {
  //   it('should work', async () => {
  //     expect(await tripService.getDetailedTrip('id')).toStrictEqual({
  //       id: 'test-id',
  //       topic: 'test-topic',
  //       ad: 'test-ad',
  //       content: 'test-content',
  //       date: '2022-01-01',
  //       region: 'test-region',
  //       meetTime: '10:00',
  //       meetPlace: 'test-meet-place',
  //       dismissTime: '12:00',
  //       dismissPlace: 'test-dismiss-place',
  //       fee: 1,
  //       other: 'test-other',
  //       ownerName: 'test-owner-name',
  //       status: Status.Pass,
  //       dateCreated: 2,
  //       dateUpdated: 3,
  //     });
  //   });
  // });

  // describe('getDetailedTrips', () => {
  //   it('should work', async () => {
  //     expect(await tripService.getDetailedTrips()).toStrictEqual([
  //       {
  //         id: 'test-id',
  //         topic: 'test-topic',
  //         date: '2022-01-01',
  //         ownerName: 'test-owner-name',
  //         ownerPhone: 'test-owner-phone',
  //         ownerLine: 'test-owner-line',
  //         code: '123456',
  //         status: Status.Pass,
  //         signs: 1,
  //         dateCreated: 2,
  //         dateUpdated: 3,
  //       },
  //     ]);
  //   });
  // });

  describe('deleteTripById', () => {
    it('should work', async () => {
      await tripService.deleteTripById('id');
      expect(mockTripAccess.hardDeleteById).toBeCalledTimes(1);
    });
  });

  describe('verifyTrip', () => {
    it('should work for pass', async () => {
      await tripService.verifyTrip('id', {
        pass: 'yes',
        expiredDate: '1234',
        notifyDate: '2345',
      });
      expect(mockTripAccess.findById).toBeCalledTimes(1);
      expect(mockTripAccess.save).toBeCalledTimes(1);
    });

    it('should work for reject', async () => {
      await tripService.verifyTrip('id', { pass: 'no', reason: 'abc' });
      expect(mockTripAccess.findById).toBeCalledTimes(1);
      expect(mockTripAccess.save).toBeCalledTimes(1);
    });
  });

  describe('getSigns', () => {
    it('should work', async () => {
      expect(await tripService.getSigns('id', '123456')).toStrictEqual([
        dummySign,
      ]);
      expect(mockTripAccess.findById).toBeCalledTimes(1);
      expect(mockSignAccess.findMany).toBeCalledTimes(1);
    });

    it('should fail', async () => {
      await expect(() => tripService.getSigns('id', 'xxxxx')).rejects.toThrow(
        UnauthorizedError
      );
      expect(mockTripAccess.findById).toBeCalledTimes(1);
    });
  });

  describe('reviseMember', () => {
    it('should work', async () => {
      await tripService.reviseMember('id', { signId: ['123456'] });
      expect(mockSignAccess.findMany).toBeCalledTimes(1);
      expect(mockSignAccess.save).toBeCalledTimes(1);
    });
  });
});
