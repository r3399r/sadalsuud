import { bindings } from 'src/bindings';
import { Sign, SignModel } from 'src/model/entity/Sign';
import { SignService } from './SignService';

/**
 * Tests of the SignService class.
 */
describe('SignService', () => {
  let signService: SignService;
  let mockSignModel: any;
  let dummySign: Sign;

  beforeAll(() => {
    dummySign = {
      id: 'test-id',
      name: 'test-name',
      phone: 'test-phone',
      yearOfBirth: 'test-year',
      isSelf: true,
      status: 'pending',
      tripId: 'trip-id',
      dateCreated: 1,
      dateUpdated: 2,
    };
  });

  beforeEach(() => {
    mockSignModel = {};
    bindings.rebind<SignModel>(SignModel).toConstantValue(mockSignModel);

    mockSignModel.replace = jest.fn();
    mockSignModel.find = jest.fn(() => dummySign);

    signService = bindings.get<SignService>(SignService);
  });

  describe('modifyComment', () => {
    it('should work', async () => {
      await signService.modifyComment('id', { comment: 'aa' });
      expect(mockSignModel.replace).toBeCalledTimes(1);
      expect(mockSignModel.find).toBeCalledTimes(1);
    });
  });
});
