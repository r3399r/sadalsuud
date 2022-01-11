import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/User';
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
  let dummyGroup: any;
  let dummyUser: any;
  let dummySign: any;

  beforeAll(() => {
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
        participant: [
          { id: 'user1-id', name: 'user1-name', phone: 'xoxox' },
          { id: 'user2-id', name: 'user2-name', phone: 'ooooo' },
        ],
        star: [
          { id: 'star1-id', name: 'star1-name', nickname: 'star1-nickname' },
          { id: 'star2-id', name: 'star2-name', nickname: 'star2-nickname' },
        ],
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
        participant: [
          { id: 'user1-id2', name: 'user1-name2', phone: 'xoxox2' },
          { id: 'user2-id2', name: 'user2-name2', phone: 'ooooo2' },
        ],
        star: [
          { id: 'star1-id2', name: 'star1-name2', nickname: 'star1-nickname2' },
          { id: 'star2-id2', name: 'star2-name2', nickname: 'star2-nickname2' },
        ],
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
    dummyUser = {
      id: 'user-id',
    };
    dummyGroup = {
      id: 'group-id',
      user: [dummyUser],
    };
    dummySign = {
      id: 'sign-id',
      group: { ...dummyGroup, id: 'group-id-2' },
      trip: dummyTrips[0],
    };
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
    mockUserService.getUserByToken = jest.fn(() => ({ role: ROLE.ADMIN }));
    expect(await tripService.getTrip('token', 'tripId')).toBe(dummyTrips[0]);
  });

  it('getTrip should work with rookie', async () => {
    mockUserService.getUserByToken = jest.fn(() => ({ role: ROLE.ROOKIE }));
    expect(await tripService.getTrip('token', 'tripId')).toStrictEqual({
      verified: true,
      id: 'test1',
      startDatetime: 1641372225000,
      endDatetime: 1641373225000,
      place: 'here',
      meetPlace: 'there',
      dismissPlace: 'there2',
      detailDesc: 'aaa',
      owner: { id: 'owner-id', name: 'owner-name' },
      participant: [
        { id: 'user1-id', name: 'user1-name' },
        { id: 'user2-id', name: 'user2-name' },
      ],
      star: [
        { id: 'star1-id', nickname: 'star1-nickname' },
        { id: 'star2-id', nickname: 'star2-nickname' },
      ],
    });

    mockDbService.getItem = jest.fn(() => dummyTrips[2]);
    expect(await tripService.getTrip('token', 'tripId')).toStrictEqual({
      verified: true,
      id: 'test3',
      startDatetime: 1641372225000,
      endDatetime: 1641373225000,
      place: 'here',
      meetPlace: 'there',
      dismissPlace: 'there2',
      detailDesc: 'aaa',
      owner: { id: 'owner-id3', name: 'owner-name3' },
      participant: undefined,
      star: undefined,
    });
  });

  it('getTrip should work with passerby', async () => {
    mockUserService.getUserByToken = jest.fn(() => ({ role: ROLE.PASSERBY }));
    expect(await tripService.getTrip('token', 'tripId')).toStrictEqual({
      verified: true,
      id: 'test1',
      startDatetime: 1641312000000,
      endDatetime: 1641398399999,
      place: 'here',
      meetPlace: '********',
      dismissPlace: '********',
      detailDesc: '********',
      owner: { id: 'owner-id', name: 'owner-name' },
      participant: [
        { id: 'user1-id', name: 'user1-name' },
        { id: 'user2-id', name: 'user2-name' },
      ],
      star: [
        { id: 'star1-id', nickname: 'star1-nickname' },
        { id: 'star2-id', nickname: 'star2-nickname' },
      ],
    });

    mockDbService.getItem = jest.fn(() => dummyTrips[2]);
    expect(await tripService.getTrip('token', 'tripId')).toStrictEqual({
      verified: true,
      id: 'test3',
      startDatetime: 1641312000000,
      endDatetime: 1641398399999,
      place: 'here',
      meetPlace: '********',
      dismissPlace: '********',
      detailDesc: '********',
      owner: { id: 'owner-id3', name: 'owner-name3' },
      participant: undefined,
      star: undefined,
    });
  });

  it('getTrips should work with admin', async () => {
    mockUserService.getUserByToken = jest.fn(() => ({ role: ROLE.ADMIN }));
    expect(await tripService.getTrips('token')).toBe(dummyTrips);
  });

  it('getTrips should work with rookie', async () => {
    mockUserService.getUserByToken = jest.fn(() => ({ role: ROLE.ROOKIE }));
    expect(await tripService.getTrips('token')).toStrictEqual([
      {
        verified: true,
        id: 'test1',
        startDatetime: 1641372225000,
        endDatetime: 1641373225000,
        place: 'here',
        meetPlace: 'there',
        dismissPlace: 'there2',
        detailDesc: 'aaa',
        owner: { id: 'owner-id', name: 'owner-name' },
        participant: [
          { id: 'user1-id', name: 'user1-name' },
          { id: 'user2-id', name: 'user2-name' },
        ],
        star: [
          { id: 'star1-id', nickname: 'star1-nickname' },
          { id: 'star2-id', nickname: 'star2-nickname' },
        ],
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
        owner: { id: 'owner-id3', name: 'owner-name3' },
        participant: undefined,
        star: undefined,
      },
    ]);
  });

  it('getTrips should work with passerby', async () => {
    mockUserService.getUserByToken = jest.fn(() => ({ role: ROLE.PASSERBY }));
    expect(await tripService.getTrips('token')).toStrictEqual([
      {
        verified: true,
        id: 'test1',
        startDatetime: 1641312000000,
        endDatetime: 1641398399999,
        place: 'here',
        meetPlace: '********',
        dismissPlace: '********',
        detailDesc: '********',
        owner: { id: 'owner-id', name: 'owner-name' },
        participant: [
          { id: 'user1-id', name: 'user1-name' },
          { id: 'user2-id', name: 'user2-name' },
        ],
        star: [
          { id: 'star1-id', nickname: 'star1-nickname' },
          { id: 'star2-id', nickname: 'star2-nickname' },
        ],
      },
      {
        verified: true,
        id: 'test3',
        startDatetime: 1641312000000,
        endDatetime: 1641398399999,
        place: 'here',
        meetPlace: '********',
        dismissPlace: '********',
        detailDesc: '********',
        owner: { id: 'owner-id3', name: 'owner-name3' },
        participant: undefined,
        star: undefined,
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
      .mockReturnValueOnce({ id: 'user-id' })
      .mockReturnValueOnce({ id: 'star-id' });
    expect(
      await tripService.setTripMember('tripId', {
        starId: ['a'],
        participantId: ['b'],
      })
    ).toMatchObject({
      ...dummyTrips[0],
      participant: [{ id: 'user-id' }],
      star: [{ id: 'star-id' }],
    });
  });

  it('signTrip should work', async () => {
    mockDbService.getItems = jest.fn(() => [dummySign]);
    mockDbService.getItem = jest
      .fn()
      .mockReturnValueOnce(dummyTrips[0])
      .mockReturnValueOnce(dummyGroup);
    expect(
      await tripService.signTrip('trip-id', {} as SignTripRequest, 'token')
    ).toMatchObject({
      result: false,
      group: dummyGroup,
    });
  });

  it('signTrip should fail if user is the owner of trip', async () => {
    mockDbService.getItem = jest
      .fn()
      .mockReturnValueOnce(dummyTrips[0])
      .mockReturnValueOnce(dummyGroup);
    mockUserService.validateRole = jest.fn(() => ({
      ...dummyUser,
      id: dummyTrips[0].owner.id,
    }));
    await expect(() =>
      tripService.signTrip('trip-id', {} as SignTripRequest, 'token')
    ).rejects.toThrowError('You cannot sign a trip whose owner is yourself.');
  });

  it('signTrip should fail if user is the owner of trip', async () => {
    mockDbService.getItems = jest.fn(() => [
      { ...dummySign, group: dummyGroup },
    ]);
    mockDbService.getItem = jest
      .fn()
      .mockReturnValueOnce(dummyTrips[0])
      .mockReturnValueOnce(dummyGroup);
    await expect(() =>
      tripService.signTrip('trip-id', {} as SignTripRequest, 'token')
    ).rejects.toThrowError('You have already signed this trip before.');
  });
});
