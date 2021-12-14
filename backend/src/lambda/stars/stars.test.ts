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

    mockStarService.addStar = jest.fn(() => dummyStar);
    mockUserService.validateRole = jest.fn();
  });

  it('POST should work', async () => {
    event = {
      httpMethod: 'POST',
      headers: { 'x-api-token': 'test-token' },
      body: JSON.stringify({ a: '1' }),
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
    };
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('null body error'))
    );
    expect(mockStarService.addStar).toBeCalledTimes(0);
  });

  it('should fail with unknown method', async () => {
    event.httpMethod = 'unknown';
    await expect(stars(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});
