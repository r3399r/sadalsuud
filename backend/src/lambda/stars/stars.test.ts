import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { StarService } from 'src/logic/StarService';
import { stars } from './stars';
import { StarsEvent } from './StarsEvent';

/**
 * Tests of the stars lambda function.
 */
describe('stars', () => {
  let event: StarsEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockStarService: any;
  let dummyStar: any;

  beforeAll(() => {
    dummyStar = { name: 'test' };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    mockStarService = {};
    bindings.rebind<StarService>(StarService).toConstantValue(mockStarService);

    mockStarService.validateRole = jest.fn();
    mockStarService.addStar = jest.fn(() => dummyStar);
    mockStarService.getStars = jest.fn(() => [dummyStar]);
    mockStarService.getStarDetail = jest.fn(() => dummyStar);
    mockStarService.removeStar = jest.fn();
    mockStarService.addRecord = jest.fn(() => dummyStar);
    mockStarService.editRecord = jest.fn(() => dummyStar);
  });

  it('GET /stars should work', async () => {
    event = {
      resource: '/api/stars',
      httpMethod: 'GET',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: null,
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      successOutput([dummyStar])
    );
    expect(mockStarService.getStars).toBeCalledTimes(1);
  });

  it('GET /stars/{id} should work', async () => {
    event = {
      resource: '/api/stars',
      httpMethod: 'GET',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: { id: 'abc' },
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyStar)
    );
    expect(mockStarService.getStarDetail).toBeCalledTimes(1);
  });

  it('POST /stars should work', async () => {
    event = {
      resource: '/api/stars',
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: null,
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyStar)
    );
    expect(mockStarService.addStar).toBeCalledTimes(1);
  });

  it('POST /stars/record should work', async () => {
    event = {
      resource: '/api/stars/record',
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: null,
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyStar)
    );
    expect(mockStarService.addRecord).toBeCalledTimes(1);
  });

  it('POST should fail if null body', async () => {
    event = {
      resource: '/api/stars',
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: null,
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new BadRequestError('body should not be empty'))
    );
  });

  it('POST should fail if non-support resource', async () => {
    event = {
      resource: '/api/stars/xxx',
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: null,
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new InternalServerError('non-support resource'))
    );
  });

  it('PUT /stars/record should work', async () => {
    event = {
      resource: '/api/stars/record',
      httpMethod: 'PUT',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: null,
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyStar)
    );
    expect(mockStarService.editRecord).toBeCalledTimes(1);
  });

  it('PUT should fail if null body', async () => {
    event = {
      resource: '/api/stars',
      httpMethod: 'PUT',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: null,
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new BadRequestError('body should not be empty'))
    );
  });

  it('PUT should fail if non-support resource', async () => {
    event = {
      resource: '/api/stars/xxx',
      httpMethod: 'PUT',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
      pathParameters: null,
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new InternalServerError('non-support resource'))
    );
  });

  it('DELETE should work', async () => {
    event = {
      resource: '/api/stars',
      httpMethod: 'DELETE',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: { id: 'test-id' },
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(undefined)
    );
    expect(mockStarService.removeStar).toBeCalledTimes(1);
  });

  it('POST should fail if null body', async () => {
    event = {
      resource: '/api/stars',
      httpMethod: 'DELETE',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: null,
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new BadRequestError('star id is required'))
    );
    expect(mockStarService.removeStar).toBeCalledTimes(0);
  });

  it('should fail with unknown method', async () => {
    event.httpMethod = 'unknown';
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new InternalServerError('unknown http method'))
    );
  });
});
