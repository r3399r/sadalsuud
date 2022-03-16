import {
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaEvent,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { MeService } from 'src/logic/MeService';
import { GetMeResponse } from 'src/model/Me';

async function apiMe(event: LambdaEvent, service: MeService) {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getMe(event.headers['x-api-token']);
    default:
      throw new InternalServerError('unknown http method');
  }
}

export async function me(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const service: MeService = bindings.get<MeService>(MeService);

    let res: GetMeResponse;

    switch (event.resource) {
      case '/api/me':
        res = await apiMe(event, service);
        break;
      default:
        throw new InternalServerError('unknown resource');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
