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

  beforeEach(() => {
    mockDbService = {};
    mockUserService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);

    mockDbService.getItemsByIndex = jest
      .fn()
      .mockReturnValueOnce([
        { id: 'trip1', owner: { id: 'user-id' } },
        { id: 'trip2', owner: { id: 'user-id-2' } },
      ])
      .mockReturnValue([{ id: 'group-id' }]);
    mockUserService.getUserByToken = jest.fn(() => ({ id: 'user-id' }));

    meService = bindings.get<MeService>(MeService);
  });

  it('getMe should work', async () => {
    expect(await meService.getMe('token')).toStrictEqual({
      id: 'user-id',
      myTrip: [{ id: 'trip1', owner: { id: 'user-id' } }],
      joinedTrip: [{ id: 'trip2', owner: { id: 'user-id-2' } }],
      myGroup: [{ id: 'group-id' }],
    });
  });
});
