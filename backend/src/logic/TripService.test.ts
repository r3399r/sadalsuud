import { DbService } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { PostTripRequest } from 'src/model/Trip';
import { User } from 'src/model/User';
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
    await tripService.registerTrip({} as PostTripRequest, {} as User);
    expect(mockDbService.createItem).toBeCalledTimes(1);
  });
});
