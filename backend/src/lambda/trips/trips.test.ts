import {
  errorOutput,
  LambdaContext,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { TripService } from 'src/logic/TripService';
import { trips } from './trips';
import { TripsEvent } from './TripsEvent';

/**
 * Tests of trips lambda function
 */
describe('trips', () => {
  let event: TripsEvent;
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
    mockTripService.getSignByTrip = jest.fn(() => [dummySign]);
  });

  it('POST /api/trips should work', async () => {
    event = {
      resource: '/api/trips',
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: null,
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyTrip)
    );
    expect(mockTripService.registerTrip).toBeCalledTimes(1);
  });

  it('POST /api/trips/{id}/sign should work', async () => {
    event = {
      resource: '/api/trips/{id}/sign',
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: { id: '123' },
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyTrip)
    );
    expect(mockTripService.signTrip).toBeCalledTimes(1);
  });

  it('POST /api/trips/{id}/sign should fail if trip id is missing', async () => {
    event = {
      resource: '/api/trips/{id}/sign',
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: null,
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('trip id is missing'))
    );
    expect(mockTripService.signTrip).toBeCalledTimes(0);
  });

  it('POST should fail if null body', async () => {
    event = {
      resource: 'resource',
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: null,
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('null body error'))
    );
    expect(mockTripService.registerTrip).toBeCalledTimes(0);
  });

  it('POST should fail if unsupported resource', async () => {
    event = {
      resource: 'resource',
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: { id: 'aa' },
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unsupported resource'))
    );
  });

  it('GET /trips should work', async () => {
    event = {
      resource: '/api/trips',
      httpMethod: 'GET',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: null,
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      successOutput([dummyTrip])
    );
    expect(mockTripService.getTrips).toBeCalledTimes(1);
  });

  it('GET /trips/{id} should work', async () => {
    event = {
      resource: '/api/trips/{id}',
      httpMethod: 'GET',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: { id: 'aa' },
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyTrip)
    );
    expect(mockTripService.getTrip).toBeCalledTimes(1);
  });

  it('GET /trips/{id} should fail if id is missing', async () => {
    event = {
      resource: '/api/trips/{id}',
      httpMethod: 'GET',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: null,
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('trip id is missing'))
    );
  });

  it('GET /trips/{id}/sign should work', async () => {
    event = {
      resource: '/api/trips/{id}/sign',
      httpMethod: 'GET',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: { id: 'aa' },
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      successOutput([dummySign])
    );
    expect(mockTripService.getSignByTrip).toBeCalledTimes(1);
  });

  it('GET /trips/{id}/sign should fail if id is missing', async () => {
    event = {
      resource: '/api/trips/{id}/sign',
      httpMethod: 'GET',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: null,
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('trip id is missing'))
    );
  });

  it('GET should fail if unsupported resource', async () => {
    event = {
      resource: 'resource',
      httpMethod: 'GET',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: { id: 'aa' },
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unsupported resource'))
    );
  });

  it('PUT /trips/{id} should work', async () => {
    event = {
      resource: '/api/trips/{id}',
      httpMethod: 'PUT',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: { id: 'aa' },
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyTrip)
    );
    expect(mockTripService.reviseTrip).toBeCalledTimes(1);
  });

  it('PUT /trips/{id}/verify should work', async () => {
    event = {
      resource: '/api/trips/{id}/verify',
      httpMethod: 'PUT',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: { id: 'aa' },
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyTrip)
    );
    expect(mockTripService.verifyTrip).toBeCalledTimes(1);
  });

  it('PUT /trips/{id}/member should work', async () => {
    event = {
      resource: '/api/trips/{id}/member',
      httpMethod: 'PUT',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: { id: 'aa' },
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyTrip)
    );
    expect(mockTripService.setTripMember).toBeCalledTimes(1);
  });

  it('PUT should fail if null body', async () => {
    event = {
      resource: 'resource',
      httpMethod: 'PUT',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: { id: 'aa' },
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('null body error'))
    );
    expect(mockTripService.verifyTrip).toBeCalledTimes(0);
  });

  it('PUT should fail if id was missing', async () => {
    event = {
      resource: 'resource',
      httpMethod: 'PUT',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: null,
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('trip id is missing'))
    );
    expect(mockTripService.verifyTrip).toBeCalledTimes(0);
  });

  it('PUT should fail if unsupported resource', async () => {
    event = {
      resource: 'resource',
      httpMethod: 'PUT',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: { id: 'aa' },
    };
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unsupported resource'))
    );
  });

  it('should fail with unknown method', async () => {
    event.httpMethod = 'unknown';
    await expect(trips(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});
