import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaEvent,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { SignService } from 'src/logic/SignService';
import { sign } from './sign';

/**
 * Tests of sign lambda function
 */
describe('sign', () => {
  let event: LambdaEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockSignService: any;

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    mockSignService = {};
    bindings.rebind<SignService>(SignService).toConstantValue(mockSignService);

    mockSignService.modifyComment = jest.fn();
    mockSignService.cleanup = jest.fn();
  });

  describe('/api/sign/{id}', () => {
    it('PUT should work', async () => {
      event = {
        resource: '/api/sign/{id}',
        httpMethod: 'PUT',
        headers: null,
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'id' },
        queryStringParameters: null,
      };
      await expect(sign(event, lambdaContext)).resolves.toStrictEqual(
        successOutput(undefined)
      );
      expect(mockSignService.modifyComment).toBeCalledTimes(1);
    });

    it('PUT should fail without pathParameters', async () => {
      event = {
        resource: '/api/sign/{id}',
        httpMethod: 'PUT',
        headers: null,
        body: JSON.stringify({ a: '1' }),
        pathParameters: null,
        queryStringParameters: null,
      };
      await expect(sign(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('pathParameters should not be empty'))
      );
    });

    it('PUT should fail without body', async () => {
      event = {
        resource: '/api/sign/{id}',
        httpMethod: 'PUT',
        headers: null,
        body: null,
        pathParameters: { id: 'id' },
        queryStringParameters: null,
      };
      await expect(sign(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new BadRequestError('body should not be empty'))
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/sign/{id}',
        httpMethod: 'XXX',
        headers: null,
        body: JSON.stringify({ a: '1' }),
        pathParameters: { id: 'id' },
        queryStringParameters: null,
      };
      await expect(sign(event, lambdaContext)).resolves.toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  it('unknown resource should fail', async () => {
    event.resource = 'resource';
    await expect(sign(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new InternalServerError('unknown resource'))
    );
  });
});
