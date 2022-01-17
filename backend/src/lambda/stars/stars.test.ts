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
    mockStarService.removeStar = jest.fn();
  });

  it('POST should work', async () => {
    event = {
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

  it('POST should fail if null body', async () => {
    event = {
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: null,
      pathParameters: null,
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new BadRequestError('body should not be empty'))
    );
    expect(mockStarService.addStar).toBeCalledTimes(0);
  });

  it('DELETE should work', async () => {
    event = {
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
