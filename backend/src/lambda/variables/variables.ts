import {
  errorOutput,
  LambdaContext,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { VariablesService } from 'src/logic/VariablesService';
import { VariablesEvent } from './VariablesEvent';

export async function variables(
  event: VariablesEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const variablesService: VariablesService =
      bindings.get<VariablesService>(VariablesService);

    let res: { [key: string]: string };

    switch (event.httpMethod) {
      case 'GET':
        if (event.queryStringParameters === null)
          throw new Error('null query string parameters');
        if (event.queryStringParameters.name === undefined)
          throw new Error('missing parameter name');

        res = variablesService.getParameters(event.queryStringParameters.name);
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
