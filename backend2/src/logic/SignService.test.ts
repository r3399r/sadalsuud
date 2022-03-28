import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { Sign } from 'src/model/entity/Sign';
import { SignService } from './SignService';

/**
 * Tests of the SignService class.
 */
describe('SignService', () => {
  let signService: SignService;
  let mockDbService: any;
  let dummySign: Sign;

  beforeAll(() => {
    dummySign = {
      id: 'test-id',
      name: 'test-name',
      phone: 'test-phone',
      yearOfBirth: 'test-year',
      isSelf: true,
      dateCreated: 1,
      dateUpdated: 2,
    };
  });

  beforeEach(() => {
    mockDbService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    mockDbService.putItem = jest.fn();
    mockDbService.getItem = jest.fn(() => dummySign);

    signService = bindings.get<SignService>(SignService);
  });

  describe('modifyComment', () => {
    it('should work', async () => {
      await signService.modifyComment('id', { comment: 'aa' });
      expect(mockDbService.putItem).toBeCalledTimes(1);
      expect(mockDbService.getItem).toBeCalledTimes(1);
    });
  });
});
