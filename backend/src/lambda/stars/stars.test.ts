import {
  errorOutput,
  LambdaContext,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { StarService } from 'src/logic/StarService';
import { UserService } from 'src/logic/UserService';
import { stars } from './stars';
import { StarsEvent } from './StarsEvent';

/**
 * Tests of the stars lambda function.
 */
describe('stars', () => {
  let event: StarsEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockStarService: any;
  let mockUserService: any;
  let dummyStar: any;

  beforeAll(() => {
    dummyStar = { name: 'test' };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    mockStarService = {};
    mockUserService = {};
    bindings.rebind<StarService>(StarService).toConstantValue(mockStarService);
    bindings.rebind<UserService>(UserService).toConstantValue(mockUserService);

    mockUserService.validateRole = jest.fn();
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
      errorOutput(new Error('null body error'))
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
      errorOutput(new Error('star id is required'))
    );
    expect(mockStarService.removeStar).toBeCalledTimes(0);
  });

  it('should fail with unknown method', async () => {
    event.httpMethod = 'unknown';
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});
