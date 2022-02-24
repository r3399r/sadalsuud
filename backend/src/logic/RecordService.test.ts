import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { EditRecordData } from 'src/model/Record';
import { Star } from 'src/model/Star';
import { User } from 'src/model/User';
import { RecordService } from './RecordService';

/**
 * Tests of the RecordService class.
 */
describe('RecordService', () => {
  let recordService: RecordService;
  let mockDbService: any;
  let dummyRecord: any;

  beforeAll(() => {
    dummyRecord = {
      id: 'aaa',
      reporter: { id: 'userId' },
      target: { id: 'starId' },
    };
  });

  beforeEach(() => {
    mockDbService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    mockDbService.createItem = jest.fn();
    mockDbService.putItem = jest.fn();
    mockDbService.getItem = jest.fn(() => dummyRecord);

    recordService = bindings.get<RecordService>(RecordService);
  });

  it('addRecord should work', async () => {
    await recordService.addRecord({} as User, {} as Star, 'content');
    expect(mockDbService.createItem).toBeCalledTimes(1);
  });

  it('editRecord should work', async () => {
    await recordService.editRecord({} as EditRecordData);
    expect(mockDbService.getItem).toBeCalledTimes(1);
    expect(mockDbService.putItem).toBeCalledTimes(1);
  });

  it('editRecord should work with all field filled', async () => {
    await recordService.editRecord({
      reporter: { id: 'abc' },
      target: { id: 'bcd' },
    } as EditRecordData);
    expect(mockDbService.getItem).toBeCalledTimes(1);
    expect(mockDbService.putItem).toBeCalledTimes(1);
  });
});
