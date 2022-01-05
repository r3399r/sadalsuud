import {
  errorOutput,
  LambdaContext,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { TripService } from 'src/logic/TripService';
import { UserService } from 'src/logic/UserService';
import { trips } from './trips';
import { TripsEvent } from './TripsEvent';

/**
 * Tests of trips lambda function
 */
describe('trips', () => {
  let event: TripsEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockUserService: any;
  let mockTripService: any;
  let dummyTrip: any;

  beforeAll(() => {
    dummyTrip = { id: 'test' };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    mockUserService = {};
    mockTripService = {};
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);
    bindings.rebind<TripService>(TripService).toConstantValue(mockTripService);

    mockUserService.validateRole = jest.fn();
    mockTripService.registerTrip = jest.fn(() => dummyTrip);
    mockTripService.getTrips = jest.fn(() => [dummyTrip]);
  });

  it('POST should work', async () => {
    event = {
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyTrip)
    );
    expect(mockTripService.registerTrip).toBeCalledTimes(1);
  });

  it('POST should fail if null body', async () => {
    event = {
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: null,
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('null body error'))
    );
    expect(mockTripService.registerTrip).toBeCalledTimes(0);
  });

  it('GET should work', async () => {
    event = {
      httpMethod: 'GET',
      headers: { 'x-api-token': 'test-token' },
      body: null,
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      successOutput([dummyTrip])
    );
    expect(mockTripService.getTrips).toBeCalledTimes(1);
  });

  it('should fail with unknown method', async () => {
    event.httpMethod = 'unknown';
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});
