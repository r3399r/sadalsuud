import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaEvent,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { TripService } from 'src/logic/TripService';
import { trips } from './trips';

/**
 * Tests of trips lambda function
 */
describe('trips', () => {
  let event: LambdaEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockTripService: any;
  let dummyTrip: any;

  beforeAll(() => {
    dummyTrip = { id: 'test' };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    mockTripService = {};
    bindings.rebind<TripService>(TripService).toConstantValue(mockTripService);

    mockTripService.registerTrip = jest.fn();
    mockTripService.getSimplifiedTrips = jest.fn(() => [dummyTrip]);
  });

  describe('/api/trips', () => {
    it('GET should work', async () => {
      event = {
        resource: '/api/trips',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        successOutput([dummyTrip])
      );
      expect(mockTripService.getSimplifiedTrips).toBeCalledTimes(1);
    });

    it('POST should work', async () => {
      event = {
        resource: '/api/trips',
        httpMethod: 'POST',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(undefined)
      );
      expect(mockTripService.registerTrip).toBeCalledTimes(1);
    });

    it('POST should fail without body', async () => {
      event = {
        resource: '/api/trips',
        httpMethod: 'POST',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/trips',
        httpMethod: 'XXX',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  it('unknown resource should fail', async () => {
    event.resource = 'resource';
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new InternalServerError('unknown resource'))
    );
  });
});
