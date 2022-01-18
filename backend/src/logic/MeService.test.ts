import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { MeService } from './MeService';
import { UserService } from './UserService';

/**
 * Tests of the MeService class
 */
describe('MeService', () => {
  let meService: MeService;
  let mockDbService: any;
  let mockUserService: any;
  let dummyGroup1: any;
  let dummyGroup2: any;

  beforeAll(() => {
    dummyGroup1 = { id: 'group1', user: [{ id: 'user-id' }] };
    dummyGroup2 = {
      id: 'group2',
      star: { id: 'star-id' },
      user: [{ id: 'user-id' }],
    };
  });

  beforeEach(() => {
    mockDbService = {};
    mockUserService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);

    mockDbService.getItemsByIndex = jest
      .fn()
      .mockReturnValueOnce([{ id: 'trip1' }])
      .mockReturnValueOnce([dummyGroup1, dummyGroup2])
      .mockReturnValueOnce([
        {
          id: 'sign1',
          group: dummyGroup1,
          trip: { id: 'trip2' },
          result: false,
        },
        {
          id: 'sign2',
          group: dummyGroup1,
          trip: { id: 'trip3' },
          result: true,
        },
      ])
      .mockReturnValueOnce([
        {
          id: 'sign3',
          group: dummyGroup2,
          trip: { id: 'trip4' },
          result: false,
        },
        {
          id: 'sign4',
          group: dummyGroup2,
          trip: { id: 'trip5' },
          result: true,
        },
      ]);
    mockUserService.getUserByToken = jest.fn(() => ({ id: 'user-id' }));

    meService = bindings.get<MeService>(MeService);
  });

  it('getMe should work', async () => {
    expect(await meService.getMe('token')).toStrictEqual({
      id: 'user-id',
      myTrip: [{ id: 'trip1' }],
      myGroup: [
        {
          group: dummyGroup1,
          signedTrip: [
            { id: 'trip2', result: false },
            { id: 'trip3', result: true },
          ],
        },
        {
          group: dummyGroup2,
          signedTrip: [
            { id: 'trip4', result: false },
            { id: 'trip5', result: true },
          ],
        },
      ],
    });
  });
});
