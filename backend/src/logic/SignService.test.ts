import { SignAccess } from 'src/access/SignAccess';
import { bindings } from 'src/bindings';
import { Sign } from 'src/model/entity/Sign';
import { SignService } from './SignService';

/**
 * Tests of the SignService class.
 */
describe('SignService', () => {
  let signService: SignService;
  let mockSignAccess: any;
  let dummySign: Sign;

  beforeAll(() => {
    dummySign = {
      id: 'test-id',
      name: 'test-name',
      phone: 'test-phone',
      line: null,
      birthYear: 'test-year',
      isSelf: true,
      accompany: null,
      canJoin: true,
      comment: null,
      tripId: 'trip-id',
      dateCreated: new Date(),
      dateUpdated: new Date(),
    };
  });

  beforeEach(() => {
    mockSignAccess = {};
    bindings.rebind<SignAccess>(SignAccess).toConstantValue(mockSignAccess);

    mockSignAccess.save = jest.fn();
    mockSignAccess.findById = jest.fn(() => dummySign);

    signService = bindings.get<SignService>(SignService);
  });

  describe('modifyComment', () => {
    it('should work', async () => {
      await signService.modifyComment('id', { comment: 'aa' });
      expect(mockSignAccess.findById).toBeCalledTimes(1);
      expect(mockSignAccess.save).toBeCalledTimes(1);
    });
  });
});
