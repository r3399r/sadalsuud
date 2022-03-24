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
import { AuthService } from 'src/logic/AuthService';
import { PostLoginRequest, PostLoginResponse } from 'src/model/api/Login';

export async function login(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const service: AuthService = bindings.get<AuthService>(AuthService);

    let res: PostLoginResponse;

    switch (event.resource) {
      case '/api/login':
        res = await apiLogin(event, service);
        break;
      default:
        throw new InternalServerError('unknown resource');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}

async function apiLogin(event: LambdaEvent, service: AuthService) {
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.login(JSON.parse(event.body) as PostLoginRequest);
    default:
      throw new InternalServerError('unknown http method');
  }
}
