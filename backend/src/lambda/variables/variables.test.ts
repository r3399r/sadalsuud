import {
  errorOutput,
  LambdaContext,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { VariablesService } from 'src/logic/VariablesService';
import { variables } from './variables';
import { VariablesEvent } from './VariablesEvent';

/**
 * Tests of the variables lambda function.
 */
describe('variables', () => {
  let event: VariablesEvent;
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

    // prepare mock mockUserService
    mockVariablesService = {};
    bindings
      .rebind<VariablesService>(VariablesService)
      .toConstantValue(mockVariablesService);

    mockVariablesService.getParameters = jest.fn(() => dummyResult);
  });

  it('GET should work', async () => {
    event = {
      httpMethod: 'GET',
      queryStringParameters: { name: 'test' },
    };
    await expect(variables(event, lambdaContext)).resolves.toStrictEqual(
      successOutput(dummyResult)
    );
    expect(mockVariablesService.getParameters).toBeCalledTimes(1);
  });

  it('GET should fail with null query string', async () => {
    event = {
      httpMethod: 'GET',
      queryStringParameters: null,
    };
    await expect(variables(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('null query string parameters'))
    );
  });

  it('GET should fail without parameter name', async () => {
    event = {
      httpMethod: 'GET',
      queryStringParameters: {},
    };
    await expect(variables(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('missing parameter name'))
    );
  });

  it('should fail with unknown method', async () => {
    event = {
      httpMethod: 'UNKNONW',
      queryStringParameters: null,
    };
    await expect(variables(event, lambdaContext)).resolves.toStrictEqual(
      errorOutput(new Error('unknown http method'))
    );
  });
});
