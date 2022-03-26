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
    mockTripService.signTrip = jest.fn();
    mockTripService.getSimplifiedTrips = jest.fn(() => [dummyTrip]);
    mockTripService.getTripForAttendee = jest.fn(() => dummyTrip);
    mockTripService.getDetailedTrips = jest.fn(() => [dummyTrip]);
    mockTripService.deleteTripById = jest.fn();
    mockTripService.verifyTrip = jest.fn();
  });

  describe('/api/trips', () => {
    it('GET should work', async () => {
      event = {
        resource: '/api/trips',
        httpMethod: 'GET',
        headers: null,
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
        headers: null,
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
        headers: null,
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
        headers: null,
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  describe('/api/trips/detail', () => {
    it('GET should work', async () => {
      event = {
        resource: '/api/trips/detail',
        httpMethod: 'GET',
        headers: null,
        body: null,
        pathParameters: { id: 'id' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        successOutput([dummyTrip])
      );
      expect(mockTripService.getDetailedTrips).toBeCalledTimes(1);
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/trips/detail',
        httpMethod: 'XXX',
        headers: null,
        body: null,
        pathParameters: { id: 'id' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  describe('/api/trips/{id}/sign', () => {
    it('PUT should work', async () => {
      event = {
        resource: '/api/trips/{id}/sign',
        httpMethod: 'PUT',
        headers: null,
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'id' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(undefined)
      );
      expect(mockTripService.signTrip).toBeCalledTimes(1);
    });

    it('PUT should fail if null pathParameters', async () => {
      event = {
        resource: '/api/trips/{id}/sign',
        httpMethod: 'PUT',
        headers: null,
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('pathParameters should not be empty'))
      );
    });

    it('PUT should fail if null body', async () => {
      event = {
        resource: '/api/trips/{id}/sign',
        httpMethod: 'PUT',
        headers: null,
        body: null,
        pathParameters: { id: 'id' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/trips/{id}/sign',
        httpMethod: 'XXX',
        headers: null,
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'id' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  describe('/api/trips/{id}', () => {
    it('GET should work', async () => {
      event = {
        resource: '/api/trips/{id}',
        httpMethod: 'GET',
        headers: null,
        body: null,
        pathParameters: { id: 'id' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyTrip)
      );
      expect(mockTripService.getTripForAttendee).toBeCalledTimes(1);
    });

    it('GET should fail if null pathParameters', async () => {
      event = {
        resource: '/api/trips/{id}',
        httpMethod: 'GET',
        headers: null,
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('pathParameters should not be empty'))
      );
    });

    it('DELETE should work', async () => {
      event = {
        resource: '/api/trips/{id}',
        httpMethod: 'DELETE',
        headers: null,
        body: null,
        pathParameters: { id: 'id' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(undefined)
      );
      expect(mockTripService.deleteTripById).toBeCalledTimes(1);
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/trips/{id}',
        httpMethod: 'XXX',
        headers: null,
        body: null,
        pathParameters: { id: 'id' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  describe('/api/trips/{id}/verify', () => {
    it('PUT should work', async () => {
      event = {
        resource: '/api/trips/{id}/verify',
        httpMethod: 'PUT',
        headers: null,
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'id' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(undefined)
      );
      expect(mockTripService.verifyTrip).toBeCalledTimes(1);
    });

    it('PUT should fail if null pathParameters', async () => {
      event = {
        resource: '/api/trips/{id}/verify',
        httpMethod: 'PUT',
        headers: null,
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('pathParameters should not be empty'))
      );
    });

    it('PUT should fail if null body', async () => {
      event = {
        resource: '/api/trips/{id}/verify',
        httpMethod: 'PUT',
        headers: null,
        body: null,
        pathParameters: { id: 'id' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/trips/{id}/verify',
        httpMethod: 'XXX',
        headers: null,
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'id' },
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
