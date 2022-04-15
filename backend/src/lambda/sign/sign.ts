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
import { SignService } from 'src/logic/SignService';
import { PutSignIdRequest } from 'src/model/api/Sign';

export async function sign(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const service: SignService = bindings.get<SignService>(SignService);

    let res: void;

    switch (event.resource) {
      case '/api/sign/{id}':
        res = await apiSignId(event, service);
        break;
      default:
        throw new InternalServerError('unknown resource');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}

async function apiSignId(event: LambdaEvent, service: SignService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.modifyComment(
        event.pathParameters.id,
        JSON.parse(event.body) as PutSignIdRequest
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}
