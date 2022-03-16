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
  let dummySign: any;

  beforeAll(() => {
    dummyTrip = { id: 'test' };
    dummySign = { id: 'sign-id' };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    mockTripService = {};
    bindings.rebind<TripService>(TripService).toConstantValue(mockTripService);

    mockTripService.validateRole = jest.fn();
    mockTripService.registerTrip = jest.fn(() => dummyTrip);
    mockTripService.getTrips = jest.fn(() => [dummyTrip]);
    mockTripService.getTrip = jest.fn(() => dummyTrip);
    mockTripService.verifyTrip = jest.fn(() => dummyTrip);
    mockTripService.reviseTrip = jest.fn(() => dummyTrip);
    mockTripService.setTripMember = jest.fn(() => dummyTrip);
    mockTripService.signTrip = jest.fn(() => dummyTrip);
    mockTripService.getSignedList = jest.fn(() => [dummySign]);
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
      expect(mockTripService.getTrips).toBeCalledTimes(1);
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
        successOutput(dummyTrip)
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

  describe('/api/trips/{id}', () => {
    it('GET should work', async () => {
      event = {
        resource: '/api/trips/{id}',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: { id: 'aa' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyTrip)
      );
      expect(mockTripService.getTrip).toBeCalledTimes(1);
    });

    it('GET should fail if id is missing', async () => {
      event = {
        resource: '/api/trips/{id}',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('trip id is missing'))
      );
    });

    it('PUT should work', async () => {
      event = {
        resource: '/api/trips/{id}',
        httpMethod: 'PUT',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'aa' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyTrip)
      );
      expect(mockTripService.reviseTrip).toBeCalledTimes(1);
    });

    it('PUT should fail without body', async () => {
      event = {
        resource: '/api/trips/{id}',
        httpMethod: 'PUT',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: { id: 'aa' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/trips/{id}',
        httpMethod: 'XXX',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'aa' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  describe('/api/trips/{id}/member', () => {
    it('PUT should work', async () => {
      event = {
        resource: '/api/trips/{id}/member',
        httpMethod: 'PUT',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'aa' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyTrip)
      );
      expect(mockTripService.setTripMember).toBeCalledTimes(1);
    });

    it('PUT should fail if id is missing', async () => {
      event = {
        resource: '/api/trips/{id}/member',
        httpMethod: 'PUT',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('trip id is missing'))
      );
    });

    it('PUT should fail without body', async () => {
      event = {
        resource: '/api/trips/{id}/member',
        httpMethod: 'PUT',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: { id: 'aa' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/trips/{id}/member',
        httpMethod: 'XXX',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'aa' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  describe('/api/trips/{id}/sign', () => {
    it('GET should work', async () => {
      event = {
        resource: '/api/trips/{id}/sign',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: { id: 'aa' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        successOutput([dummySign])
      );
      expect(mockTripService.getSignedList).toBeCalledTimes(1);
    });

    it('GET should fail if id is missing', async () => {
      event = {
        resource: '/api/trips/{id}/sign',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('trip id is missing'))
      );
    });

    it('POST should work', async () => {
      event = {
        resource: '/api/trips/{id}/sign',
        httpMethod: 'POST',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: '123' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyTrip)
      );
      expect(mockTripService.signTrip).toBeCalledTimes(1);
    });

    it('POST should fail if trip id is missing', async () => {
      event = {
        resource: '/api/trips/{id}/sign',
        httpMethod: 'POST',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('trip id is missing'))
      );
    });

    it('POST should fail without body', async () => {
      event = {
        resource: '/api/trips/{id}/sign',
        httpMethod: 'POST',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: { id: '123' },
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
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'aa' },
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
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'aa' },
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyTrip)
      );
      expect(mockTripService.verifyTrip).toBeCalledTimes(1);
    });

    it('PUT should fail if trip id is missing', async () => {
      event = {
        resource: '/api/trips/{id}/verify',
        httpMethod: 'PUT',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('trip id is missing'))
      );
    });

    it('PUT should fail without body', async () => {
      event = {
        resource: '/api/trips/{id}/verify',
        httpMethod: 'PUT',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: { id: '123' },
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
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'aa' },
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
