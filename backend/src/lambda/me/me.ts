import {
  errorOutput,
  LambdaContext,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ERROR_CODE } from 'src/constant/error';
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
        throw new Error(ERROR_CODE.UNKNOWN_HTTP_METHOD);
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
