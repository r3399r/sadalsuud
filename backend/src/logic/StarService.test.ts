import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/user';
import { PostRecordRequest, PutRecordRequest } from 'src/model/Record';
import { RecordService } from './RecordService';
import { StarService } from './StarService';
import { UserService } from './UserService';

/**
 * Tests of the StarService class.
 */
describe('StarService', () => {
  let starService: StarService;
  let mockDbService: any;
  let mockUserService: any;
  let mockRecordService: any;
  let dummyStar: any;
  let dummyUser: any;

  beforeAll(() => {
    dummyStar = { id: 'aaa', name: 'abc' };
    dummyUser = { id: 'userId', name: 'cccc' };
  });

  beforeEach(() => {
    mockDbService = {};
    mockUserService = {};
    mockRecordService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);
    bindings
      .rebind<RecordService>(RecordService)
      .toConstantValue(mockRecordService);

    mockDbService.createItem = jest.fn();
    mockDbService.deleteItem = jest.fn();
    mockDbService.getItem = jest.fn();
    mockDbService.getItems = jest.fn(() => [dummyStar]);
    mockDbService.getItemsByIndex = jest.fn(() => [dummyStar]);
    mockUserService.validateRole = jest.fn();
    mockUserService.getUserById = jest.fn(() => dummyUser);
    mockRecordService.addRecord = jest.fn();
    mockRecordService.editRecord = jest.fn();

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

  it('getStarDetail should work', async () => {
    mockDbService.getItemsByIndex = jest.fn(() => [
      {
        id: 'a',
        content: 'b',
        dateCreated: 1,
        dateUpdated: 2,
        reporter: { name: 'c' },
      },
    ]);
    await starService.getStarDetail('test-id');
    expect(mockDbService.getItemsByIndex).toBeCalledTimes(1);
    expect(mockDbService.getItem).toBeCalledTimes(1);
  });

  it('getStars should work', async () => {
    await starService.getStars();
    expect(mockDbService.getItems).toBeCalledTimes(1);
    expect(mockDbService.getItemsByIndex).toBeCalledTimes(1);
  });

  it('addRecord should work', async () => {
    await starService.addRecord({} as PostRecordRequest);
    expect(mockDbService.getItem).toBeCalledTimes(1);
    expect(mockUserService.getUserById).toBeCalledTimes(1);
    expect(mockRecordService.addRecord).toBeCalledTimes(1);
  });

  it('editRecord should work', async () => {
    await starService.editRecord({} as PutRecordRequest);
    expect(mockDbService.getItem).toBeCalledTimes(0);
    expect(mockUserService.getUserById).toBeCalledTimes(0);
    expect(mockRecordService.editRecord).toBeCalledTimes(1);
  });

  it('editRecord should work with all field filled', async () => {
    await starService.editRecord({
      reporterId: 'aaa',
      targetId: 'bbb',
    } as PutRecordRequest);
    expect(mockDbService.getItem).toBeCalledTimes(1);
    expect(mockUserService.getUserById).toBeCalledTimes(1);
    expect(mockRecordService.editRecord).toBeCalledTimes(1);
  });
});
