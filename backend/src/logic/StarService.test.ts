import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/User';
import { StarService } from './StarService';
import { UserService } from './UserService';

/**
 * Tests of the StarService class.
 */
describe('StarService', () => {
  let starService: StarService;
  let mockDbService: any;
  let mockUserService: any;

  beforeEach(() => {
    mockDbService = {};
    mockUserService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);

    mockDbService.createItem = jest.fn();
    mockDbService.deleteItem = jest.fn();
    mockDbService.getItem = jest.fn();
    mockUserService.validateRole = jest.fn();

    starService = bindings.get<StarService>(StarService);
  });

  it('validateRole should wrok', async () => {
    await starService.validateRole('token', [ROLE.ADMIN]);
    expect(mockUserService.validateRole).toBeCalledTimes(1);
  });

  it('addStar should work', async () => {
    await starService.addStar({
      name: 'name',
      nickname: 'nickname',
      birthday: 'birthday',
    });
    expect(mockDbService.createItem).toBeCalledTimes(1);
  });

  it('removeStar should work', async () => {
    await starService.removeStar('test-id');
    expect(mockDbService.deleteItem).toBeCalledTimes(1);
  });

  it('getStar should work', async () => {
    await starService.getStar('test-id');
    expect(mockDbService.getItem).toBeCalledTimes(1);
  });
});
