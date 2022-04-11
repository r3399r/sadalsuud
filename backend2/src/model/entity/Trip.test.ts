import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { Trip, TripModel } from './Trip';

/**
 * Tests of the Trip class.
 */
describe('Trip', () => {
  let tripModel: TripModel;
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

    tripModel = bindings.get<TripModel>(TripModel);
  });

  describe('find', () => {
    it('should work', async () => {
      expect(await tripModel.find('id')).toBe(dummyResult);
    });
  });

  describe('findAll', () => {
    it('should work', async () => {
      expect(await tripModel.findAll()).toStrictEqual([dummyResult]);
    });
  });

  describe('create', () => {
    it('should work', async () => {
      await tripModel.create({} as Trip);
      expect(mockDbService.createItem).toBeCalledTimes(1);
    });
  });

  describe('replace', () => {
    it('should work', async () => {
      await tripModel.replace({} as Trip);
      expect(mockDbService.putItem).toBeCalledTimes(1);
    });
  });

  describe('softDelete', () => {
    it('should work', async () => {
      await tripModel.softDelete('id');
      expect(mockDbService.getItem).toBeCalledTimes(1);
      expect(mockDbService.putItem).toBeCalledTimes(1);
    });
  });

  describe('hardDelete', () => {
    it('should work', async () => {
      await tripModel.hardDelete('id');
      expect(mockDbService.deleteItem).toBeCalledTimes(1);
    });
  });
});
