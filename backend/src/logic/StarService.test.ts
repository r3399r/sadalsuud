import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { StarService } from './StarService';

/**
 * Tests of the StarService class.
 */
describe('StarService', () => {
  let starService: StarService;
  let mockDbService: any;

  beforeEach(() => {
    // prepare mockDbService
    mockDbService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    mockDbService.createItem = jest.fn();
    mockDbService.deleteItem = jest.fn();
    mockDbService.getItem = jest.fn();

    starService = bindings.get<StarService>(StarService);
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
