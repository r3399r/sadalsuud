import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { Sign, SignModel } from './Sign';

/**
 * Tests of the Sign class.
 */
describe('Sign', () => {
  let signModel: SignModel;
  let mockDbService: any;
  const dummyResult = { a: 1 };

  beforeEach(() => {
    mockDbService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    mockDbService.getItem = jest.fn(() => dummyResult);
    mockDbService.getItems = jest.fn(() => [dummyResult]);
    mockDbService.createItem = jest.fn();
    mockDbService.putItem = jest.fn();
    mockDbService.deleteItem = jest.fn();

    signModel = bindings.get<SignModel>(SignModel);
  });

  describe('find', () => {
    it('should work', async () => {
      expect(await signModel.find('id')).toBe(dummyResult);
    });
  });

  describe('findAll', () => {
    it('should work', async () => {
      expect(await signModel.findAll()).toStrictEqual([dummyResult]);
    });
  });

  describe('create', () => {
    it('should work', async () => {
      await signModel.create({} as Sign);
      expect(mockDbService.createItem).toBeCalledTimes(1);
    });
  });

  describe('replace', () => {
    it('should work', async () => {
      await signModel.replace({} as Sign);
      expect(mockDbService.putItem).toBeCalledTimes(1);
    });
  });

  describe('softDelete', () => {
    it('should work', async () => {
      await signModel.softDelete('id');
      expect(mockDbService.getItem).toBeCalledTimes(1);
      expect(mockDbService.putItem).toBeCalledTimes(1);
    });
  });

  describe('hardDelete', () => {
    it('should work', async () => {
      await signModel.hardDelete('id');
      expect(mockDbService.deleteItem).toBeCalledTimes(1);
    });
  });
});
