import {
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { MeService } from 'src/logic/MeService';
import { GetMeResponse } from 'src/model/Me';
import { MeEvent } from './MeEvent';

export async function me(
  event: MeEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const meService: MeService = bindings.get<MeService>(MeService);

    let res: GetMeResponse;

    switch (event.httpMethod) {
      case 'GET':
        res = await meService.getMe(event.headers['x-api-token']);
        break;
      default:
        throw new InternalServerError('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
