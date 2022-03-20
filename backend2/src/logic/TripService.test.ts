import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { PostTripsRequest } from 'src/model/api/Trip';
import { TripService } from './TripService';

/**
 * Tests of the TripService class.
 */
describe('TripService', () => {
  let tripService: TripService;
  let mockDbService: any;

  beforeEach(() => {
    mockDbService = {};
    bindings.rebind<DbService>(DbService).toConstantValue(mockDbService);

    mockDbService.createItem = jest.fn();

    tripService = bindings.get<TripService>(TripService);
  });

  it('registerTrip should work', async () => {
    await tripService.registerTrip({} as PostTripsRequest);
    expect(mockDbService.createItem).toBeCalledTimes(1);
  });
});
