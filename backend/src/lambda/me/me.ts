import {
  errorOutput,
  LambdaContext,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ERROR_CODE } from 'src/constant/error';
import { UserService } from 'src/logic/UserService';
import { GetMeResponse } from 'src/model/User';
import { MeEvent } from './MeEvent';

export async function me(
  event: MeEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const userService: UserService = bindings.get<UserService>(UserService);

    let res: GetMeResponse;

    switch (event.httpMethod) {
      case 'GET':
        res = await userService.getUserByToken(event.headers['x-api-token']);
        break;
      default:
        throw new Error(ERROR_CODE.UNKNOWN_HTTP_METHOD);
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
