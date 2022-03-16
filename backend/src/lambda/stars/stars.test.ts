import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaEvent,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { StarService } from 'src/logic/StarService';
import { stars } from './stars';

/**
 * Tests of the stars lambda function.
 */
describe('stars', () => {
  let event: LambdaEvent;
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

  describe('/api/stars', () => {
    it('GET should work', async () => {
      event = {
        resource: '/api/stars',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
        successOutput([dummyStar])
      );
      expect(mockStarService.getStars).toBeCalledTimes(1);
    });

    it('POST should work', async () => {
      event = {
        resource: '/api/stars',
        httpMethod: 'POST',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyStar)
      );
      expect(mockStarService.addStar).toBeCalledTimes(1);
    });

    it('POST should fail if null body', async () => {
      event = {
        resource: '/api/stars',
        httpMethod: 'POST',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/stars',
        httpMethod: 'XXX',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  describe('/api/stars/record', () => {
    it('POST should work', async () => {
      event = {
        resource: '/api/stars/record',
        httpMethod: 'POST',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyStar)
      );
      expect(mockStarService.addRecord).toBeCalledTimes(1);
    });

    it('PUT should work', async () => {
      event = {
        resource: '/api/stars/record',
        httpMethod: 'PUT',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyStar)
      );
      expect(mockStarService.editRecord).toBeCalledTimes(1);
    });

    it('POST should fail if null body', async () => {
      event = {
        resource: '/api/stars/record',
        httpMethod: 'POST',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/stars/record',
        httpMethod: 'XXX',
        headers: { 'x-api-token': 'test-token' },
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  describe('/api/stars/{id}', () => {
    it('GET should work', async () => {
      event = {
        resource: '/api/stars/{id}',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: { id: 'abc' },
        queryStringParameters: null,
      };
      await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyStar)
      );
      expect(mockStarService.getStarDetail).toBeCalledTimes(1);
    });

    it('DELETE should work', async () => {
      event = {
        resource: '/api/stars/{id}',
        httpMethod: 'DELETE',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: { id: 'test-id' },
        queryStringParameters: null,
      };
      await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(undefined)
      );
      expect(mockStarService.removeStar).toBeCalledTimes(1);
    });

    it('GET should fail if null pathparameter', async () => {
      event = {
        resource: '/api/stars/{id}',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('star id is required'))
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/stars/{id}',
        httpMethod: 'XXX',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: { id: 'abc' },
        queryStringParameters: null,
      };
      await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  it('unknown resource should fail', async () => {
    event.resource = 'resource';
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new InternalServerError('unknown resource'))
    );
  });
});
