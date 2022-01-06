import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/User';
import { PostTripRequest } from 'src/model/Trip';
import { User } from 'src/model/User';
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
        owner: { id: 'owner-id', name: 'owner-name', phone: 'xxxxx' },
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

    tripService = bindings.get<TripService>(TripService);
  });

  it('registerTrip should work', async () => {
    await tripService.registerTrip({} as PostTripRequest, {} as User);
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
});
