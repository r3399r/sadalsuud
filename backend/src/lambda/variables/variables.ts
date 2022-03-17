import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaEvent,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { VariablesService } from 'src/logic/VariablesService';

function apiVariables(event: LambdaEvent, service: VariablesService) {
  switch (event.httpMethod) {
    case 'GET':
      if (event.queryStringParameters === null)
        throw new BadRequestError('null query string parameters');
      if (event.queryStringParameters.name === undefined)
        throw new BadRequestError('missing parameter name');

      return service.getParameters(event.queryStringParameters.name);
    default:
      throw new InternalServerError('unknown http method');
  }
}

export async function variables(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const service: VariablesService =
      bindings.get<VariablesService>(VariablesService);

    let res: { [key: string]: string };

    switch (event.resource) {
      case '/api/variables':
        res = apiVariables(event, service);
        break;
      default:
        throw new InternalServerError('unknown resource');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
