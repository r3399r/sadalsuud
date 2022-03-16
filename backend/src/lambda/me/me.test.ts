import {
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaEvent,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { MeService } from 'src/logic/MeService';
import { me } from './me';

/**
 * Tests of the me lambda function.
 */
describe('me', () => {
  let event: LambdaEvent;
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

  describe('/api/me', () => {
    it('GET should work', async () => {
      event = {
        resource: '/api/me',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(me(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(dummyResult)
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/me',
        httpMethod: 'XXX',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(me(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  it('unknown resource should fail', async () => {
    event.resource = 'resource';
    await expect(me(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new InternalServerError('unknown resource'))
    );
  });
});
