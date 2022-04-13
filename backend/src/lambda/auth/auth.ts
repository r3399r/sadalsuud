import { LambdaContext } from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { AuthService } from 'src/logic/AuthService';
import { AuthEvent } from './AuthEvent';

export async function auth(
  event: AuthEvent,
  _context?: LambdaContext
): Promise<any> {
  const authService: AuthService = bindings.get<AuthService>(AuthService);

  try {
    authService.validate(event.authorizationToken);

    return authService.authResponse(true, String(process.env.sourceArn));
  } catch {
    throw 'Unauthorized';
  }
}
