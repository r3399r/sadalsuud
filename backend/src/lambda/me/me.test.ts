import {
  errorOutput,
  InternalServerError,
  LambdaContext,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { MeService } from 'src/logic/MeService';
import { me } from './me';
import { MeEvent } from './MeEvent';

/**
 * Tests of the me lambda function.
 */
describe('me', () => {
  let event: MeEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockMeService: any;
  let dummyResult: { [key: string]: string };

  beforeAll(() => {
    dummyResult = {
      b: 'abc',
    };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mockMeService
    mockMeService = {};
    bindings.rebind<MeService>(MeService).toConstantValue(mockMeService);

    mockMeService.getMe = jest.fn(() => dummyResult);
  });

  it('GET should work', async () => {
    event = {
      httpMethod: 'GET',
      headers: { 'x-api-token': 'test-token' },
    };
    await expect(me(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyResult)
    );
  });

  it('should fail with unknown method', async () => {
    event.httpMethod = 'unknown';
    await expect(me(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new InternalServerError('unknown http method'))
    );
  });
});
