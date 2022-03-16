import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaEvent,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { VariablesService } from 'src/logic/VariablesService';
import { VariablesParams } from 'src/model/Variable';
import { variables } from './variables';

/**
 * Tests of the variables lambda function.
 */
describe('variables', () => {
  let event: LambdaEvent;
  let lambdaContext: LambdaContext | undefined;
  let mockVariablesService: any;
  let dummyResult: { [key: string]: string };

  beforeAll(() => {
    dummyResult = {
      a: '123',
      b: 'abc',
    };
  });

  beforeEach(() => {
    lambdaContext = { awsRequestId: '456' };

    // prepare mockVariablesService
    mockVariablesService = {};
    bindings
      .rebind<VariablesService>(VariablesService)
      .toConstantValue(mockVariablesService);

    mockVariablesService.getParameters = jest.fn(() => dummyResult);
  });

  describe('/api/variables', () => {
    it('GET should work', async () => {
      event = {
        resource: '/api/variables',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: { name: 'test' },
      };
      expect(variables(event, lambdaContext)).toStrictEqual(
        successOutput(dummyResult)
      );
      expect(mockVariablesService.getParameters).toBeCalledTimes(1);
    });

    it('GET should fail with null query string', async () => {
      event = {
        resource: '/api/variables',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: null,
      };
      expect(variables(event, lambdaContext)).toStrictEqual(
        errorOutput(new BadRequestError('null query string parameters'))
      );
    });

    it('GET should fail without parameter name', async () => {
      event = {
        resource: '/api/variables',
        httpMethod: 'GET',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: {} as any as VariablesParams,
      };
      expect(variables(event, lambdaContext)).toStrictEqual(
        errorOutput(new BadRequestError('missing parameter name'))
      );
    });

    it('unknown http method should fail', async () => {
      event = {
        resource: '/api/variables',
        httpMethod: 'XXX',
        headers: { 'x-api-token': 'test-token' },
        body: null,
        pathParameters: null,
        queryStringParameters: { name: 'test' },
      };
      expect(variables(event, lambdaContext)).toStrictEqual(
        errorOutput(new InternalServerError('unknown http method'))
      );
    });
  });

  it('unknown resource should fail', async () => {
    event.resource = 'resource';
    expect(variables(event, lambdaContext)).toStrictEqual(
      errorOutput(new InternalServerError('unknown resource'))
    );
  });
});
