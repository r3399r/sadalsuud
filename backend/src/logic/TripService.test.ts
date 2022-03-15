import { DbService, UnauthorizedError } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/user';
import {
  PostTripRequest,
  ReviseTripRequest,
  SignTripRequest,
} from 'src/model/Trip';
import { TripService } from './TripService';
import { UserService } from './UserService';

/**
 * Tests of the TripService class.
 */
describe('TripService', () => {
  let tripService: TripService;
  let mockDbService: any;
  let mockUserService: any;
  let dummyTrips: any;
  let dummyGroups: any;
  let dummyUser: any;
  let dummySigns: any;

  beforeAll(() => {
    dummyUser = {
      id: 'user-id',
      role: ROLE.ADMIN,
    };
    dummyGroups = [
      {
        id: 'group-id-1',
        user: [{ id: 'user-id-1', name: 'user-name-2', phone: 'xoxox' }],
        star: {
          id: 'star-id-1',
          name: 'star-name-1',
          nickname: 'star-nickname-1',
        },
      },
      {
        id: 'group-id-2',
        user: [{ id: 'user-id-2', name: 'user-name-2', phone: 'xoxox' }],
      },
    ];
    dummyTrips = [
      {
        verified: true,
        id: 'test1',
        startDatetime: 1641372225000,
        endDatetime: 1641373225000,
        place: 'here',
        meetPlace: 'there',
        dismissPlace: 'there2',
        detailDesc: 'aaa',
        owner: {
          id: 'owner-id',
          name: 'owner-name',
          phone: 'xxxxx',
          role: 'soft-planner',
        },
        joinedGroup: dummyGroups,
      },
      {
        verified: false,
        id: 'test2',
        startDatetime: 1641372225000,
        endDatetime: 1641373225000,
        place: 'here2',
        meetPlace: 'there2',
        dismissPlace: 'there4',
        detailDesc: 'aaa2',
        owner: { id: 'owner-id2', name: 'owner-name2', phone: 'xxxxx2' },
        joinedGroup: dummyGroups,
      },
      {
        verified: true,
        id: 'test3',
        startDatetime: 1641372225000,
        endDatetime: 1641373225000,
        place: 'here',
        meetPlace: 'there',
        dismissPlace: 'there2',
        detailDesc: 'aaa',
        owner: { id: 'owner-id3', name: 'owner-name3', phone: 'xxxxx3' },
      },
    ];
    dummySigns = [
      {
        id: 'sign-1',
        trip: dummyTrips[0],
        group: {
          id: 'group-id-1',
          star: undefined,
          user: [{ id: 'user1-id' }],
        },
      },
      {
        id: 'sign-2',
        trip: dummyTrips[0],
        group: {
          id: 'group-id-2',
          star: undefined,
          user: [{ id: 'user-id-no' }],
        },
      },
      {
        id: 'sign-3',
        trip: dummyTrips[0],
        group: {
          id: 'group-id-3',
          star: { id: 'star1-id' },
          user: [{ id: 'user2-id' }],
        },
      },
      {
        id: 'sign-4',
        trip: dummyTrips[0],
        group: {
          id: 'group-id-4',
          star: { id: 'star-id-no' },
          user: [{ id: 'user3-id' }],
        },
      },
    ];
  });

  beforeEach(() => {
    mockDbService = {};
    mockUserService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);

    mockDbService.createItem = jest.fn();
    mockDbService.getItems = jest.fn(() => dummyTrips);
    mockDbService.getItem = jest.fn(() => dummyTrips[0]);
    mockDbService.putItem = jest.fn();
    mockUserService.validateRole = jest.fn(() => dummyUser);
    mockDbService.getItemsByIndex = jest.fn(() => dummySigns);

    tripService = bindings.get<TripService>(TripService);
  });

  it('validateRole should wrok', async () => {
    await tripService.validateRole('token', [ROLE.ADMIN]);
    expect(mockUserService.validateRole).toBeCalledTimes(1);
  });

  it('registerTrip should work', async () => {
    await tripService.registerTrip({} as PostTripRequest, 'token');
    expect(mockDbService.createItem).toBeCalledTimes(1);
  });

  it('getTrip should work with admin', async () => {
    const { joinedGroup, ...restTrip } = dummyTrips[0];
    mockUserService.getUserByToken = jest.fn(() => ({ role: ROLE.ADMIN }));
    expect(await tripService.getTrip('token', 'tripId')).toStrictEqual({
      ...restTrip,
      volunteer: [{ id: 'user-id-2', name: 'user-name-2', phone: 'xoxox' }],
      star: [
        { id: 'star-id-1', name: 'star-name-1', nickname: 'star-nickname-1' },
      ],
    });

    mockDbService.getItem = jest.fn(() => dummyTrips[2]);
    expect(await tripService.getTrip('token', 'tripId')).toStrictEqual({
      ...dummyTrips[2],
      owner: { id: 'owner-id3', name: 'owner-name3', phone: 'xxxxx3' },
      volunteer: [],
      star: [],
    });
  });

  it('getTrip should work with rookie', async () => {
    const { joinedGroup, ...restTrip } = dummyTrips[0];
    mockUserService.getUserByToken = jest.fn(() => ({ role: ROLE.ROOKIE }));
    expect(await tripService.getTrip('token', 'tripId')).toStrictEqual({
      ...restTrip,
      owner: { id: 'owner-id', name: 'owner-name' },
      volunteer: [{ id: 'user-id-2', name: 'user-name-2' }],
      star: [{ id: 'star-id-1', nickname: 'star-nickname-1' }],
    });

    mockDbService.getItem = jest.fn(() => dummyTrips[2]);
    expect(await tripService.getTrip('token', 'tripId')).toStrictEqual({
      ...dummyTrips[2],
      owner: { id: 'owner-id3', name: 'owner-name3' },
      volunteer: [],
      star: [],
    });
  });

  it('getTrip should work with passerby', async () => {
    const { joinedGroup, ...restTrip } = dummyTrips[0];
    mockUserService.getUserByToken = jest.fn(() => ({ role: ROLE.PASSERBY }));
    expect(await tripService.getTrip('token', 'tripId')).toStrictEqual({
      ...restTrip,
      startDatetime: 1641312000000,
      endDatetime: 1641398399999,
      meetPlace: '********',
      dismissPlace: '********',
      detailDesc: '********',
      owner: { id: 'owner-id', name: 'owner-name' },
      volunteer: [{ id: 'user-id-2', name: 'user-name-2' }],
      star: [{ id: 'star-id-1', nickname: 'star-nickname-1' }],
    });

    mockDbService.getItem = jest.fn(() => dummyTrips[2]);
    expect(await tripService.getTrip('token', 'tripId')).toStrictEqual({
      ...dummyTrips[2],
      startDatetime: 1641312000000,
      endDatetime: 1641398399999,
      meetPlace: '********',
      dismissPlace: '********',
      detailDesc: '********',
      owner: { id: 'owner-id3', name: 'owner-name3' },
      volunteer: [],
      star: [],
    });
  });

  it('getTrips should work with admin', async () => {
    mockUserService.getUserByToken = jest.fn(() => ({ role: ROLE.ADMIN }));
    expect(await tripService.getTrips('token')).toStrictEqual([
      {
        ...dummyTrips[0],
        volunteer: [{ id: 'user-id-2', name: 'user-name-2', phone: 'xoxox' }],
        star: [
          { id: 'star-id-1', name: 'star-name-1', nickname: 'star-nickname-1' },
        ],
      },
      {
        ...dummyTrips[1],
        volunteer: [{ id: 'user-id-2', name: 'user-name-2', phone: 'xoxox' }],
        star: [
          { id: 'star-id-1', name: 'star-name-1', nickname: 'star-nickname-1' },
        ],
      },
      {
        ...dummyTrips[2],
        volunteer: [],
        star: [],
      },
    ]);
  });

  it('getTrips should work with planner', async () => {
    mockUserService.getUserByToken = jest.fn(() => ({
      role: ROLE.SOFT_PLANNER,
    }));
    expect(await tripService.getTrips('token')).toStrictEqual([
      {
        ...dummyTrips[0],
        owner: { id: 'owner-id', name: 'owner-name' },
        volunteer: [{ id: 'user-id-2', name: 'user-name-2' }],
        star: [{ id: 'star-id-1', nickname: 'star-nickname-1' }],
      },
      {
        ...dummyTrips[2],
        owner: { id: 'owner-id3', name: 'owner-name3' },
        volunteer: [],
        star: [],
      },
    ]);
  });

  it('getTrips should work with passerby', async () => {
    mockUserService.getUserByToken = jest.fn(() => ({ role: ROLE.PASSERBY }));
    expect(await tripService.getTrips('token')).toStrictEqual([
      {
        ...dummyTrips[0],
        startDatetime: 1641312000000,
        endDatetime: 1641398399999,
        meetPlace: '********',
        dismissPlace: '********',
        detailDesc: '********',
        owner: { id: 'owner-id', name: 'owner-name' },
        volunteer: [{ id: 'user-id-2', name: 'user-name-2' }],
        star: [{ id: 'star-id-1', nickname: 'star-nickname-1' }],
      },
      {
        ...dummyTrips[2],
        startDatetime: 1641312000000,
        endDatetime: 1641398399999,
        meetPlace: '********',
        dismissPlace: '********',
        detailDesc: '********',
        owner: { id: 'owner-id3', name: 'owner-name3' },
        volunteer: [],
        star: [],
      },
    ]);
  });

  it('verifyTrip should work', async () => {
    mockDbService.getItem = jest.fn(() => dummyTrips[1]);
    expect(
      await tripService.verifyTrip('tripId', { expiredDatetime: 12345 })
    ).toMatchObject({
      verified: true,
      expiredDatetime: 12345,
    });
  });

  it('reviseTrip should work', async () => {
    mockUserService.getUserByToken = jest.fn(() => ({
      id: 'owner-id',
      role: 'soft-planner',
    }));
    await tripService.reviseTrip('tripId', {} as ReviseTripRequest, 'token');
    expect(mockDbService.getItem).toBeCalledTimes(1);
    expect(mockDbService.putItem).toBeCalledTimes(1);
  });

  it('reviseTrip should fail for permission denied', async () => {
    mockUserService.getUserByToken = jest.fn(() => ({
      id: 'owner-id2',
      role: 'soft-planner',
    }));
    await expect(() =>
      tripService.reviseTrip('tripId', {} as ReviseTripRequest, 'token')
    ).rejects.toThrowError('permission denied');
    expect(mockDbService.getItem).toBeCalledTimes(1);
    expect(mockDbService.putItem).toBeCalledTimes(0);
  });

  it('setTripMember should work', async () => {
    mockDbService.getItem = jest
      .fn()
      .mockReturnValueOnce(dummyTrips[0])
      .mockReturnValueOnce(dummyGroups[0])
      .mockReturnValueOnce(dummyGroups[1]);
    expect(
      await tripService.setTripMember('tripId', {
        groupId: ['group-id-1', 'group-id-2'],
      })
    ).toMatchObject({
      ...dummyTrips[0],
      joinedGroup: [{ id: 'group-id-1' }, { id: 'group-id-2' }],
    });
    expect(mockDbService.getItemsByIndex).toBeCalledTimes(1);
    expect(mockDbService.putItem).toBeCalledTimes(3);
  });

  it('setTripMember should fail if input group did not sign', async () => {
    mockDbService.getItem = jest
      .fn()
      .mockReturnValueOnce(dummyTrips[0])
      .mockReturnValueOnce(dummyGroups[0])
      .mockReturnValueOnce(dummyGroups[1]);
    await expect(() =>
      tripService.setTripMember('tripId', {
        groupId: ['group-id-1', 'group-id-no'],
      })
    ).rejects.toThrowError('some of input groups did not sign this trip');
    expect(mockDbService.getItemsByIndex).toBeCalledTimes(1);
    expect(mockDbService.putItem).toBeCalledTimes(0);
  });

  it('getSignedList should work', async () => {
    mockUserService.getUserByToken = jest.fn(() => dummyUser);
    mockDbService.getItem = jest.fn(() => dummyTrips[0]);
    mockDbService.getItemsByIndex = jest.fn(() => dummySigns);
    expect(await tripService.getSignedList('trip-id', 'token')).toBe(
      dummySigns
    );
  });

  it('getSignedList should throw error', async () => {
    mockUserService.getUserByToken = jest.fn(() => ({
      ...dummyUser,
      role: ROLE.PASSERBY,
    }));
    mockDbService.getItem = jest.fn(() => dummyTrips[0]);
    mockDbService.getItemsByIndex = jest.fn(() => dummySigns);
    await expect(() =>
      tripService.getSignedList('trip-id', 'token')
    ).rejects.toThrow(UnauthorizedError);
  });

  it('signTrip should work', async () => {
    mockDbService.getItems = jest.fn(() => dummySigns);
    mockDbService.getItem = jest
      .fn()
      .mockReturnValueOnce(dummyTrips[0])
      .mockReturnValueOnce({
        id: 'group-id-5',
        user: [{ id: 'user-id-5' }],
      });
    mockDbService.getItemsByIndex = jest.fn(() => dummySigns);
    expect(
      await tripService.signTrip('trip-id', {} as SignTripRequest, 'token')
    ).toMatchObject({
      result: false,
      group: {
        id: 'group-id-5',
        user: [{ id: 'user-id-5' }],
      },
    });
  });

  it('signTrip should fail if user is the owner of trip', async () => {
    mockDbService.getItem = jest
      .fn()
      .mockReturnValueOnce(dummyTrips[0])
      .mockReturnValueOnce({
        id: 'group-id-5',
        user: [{ id: 'owner-id' }],
      });
    mockUserService.validateRole = jest.fn(() => ({
      ...dummyUser,
      id: dummyTrips[0].owner.id,
    }));
    await expect(() =>
      tripService.signTrip('trip-id', {} as SignTripRequest, 'token')
    ).rejects.toThrowError('You cannot sign a trip whose owner is yourself.');
  });

  it('signTrip should fail if user haved signed this trip', async () => {
    mockDbService.getItemsByIndex = jest.fn(() => [
      { ...dummySigns, group: dummyGroups[0] },
    ]);
    mockDbService.getItem = jest
      .fn()
      .mockReturnValueOnce(dummyTrips[0])
      .mockReturnValueOnce(dummyGroups[0]);
    await expect(() =>
      tripService.signTrip('trip-id', {} as SignTripRequest, 'token')
    ).rejects.toThrowError('You have already signed this trip before.');
  });
});
