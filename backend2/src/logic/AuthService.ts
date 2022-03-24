import { UnauthorizedError } from '@y-celestial/service';
import { format } from 'date-fns';
import { injectable } from 'inversify';
import { PostLoginRequest, PostLoginResponse } from 'src/model/api/Login';
import { encrypt } from 'src/util/crypto';

/**
 * Service class to validate line user
 */
@injectable()
export class AuthService {
  public login(body: PostLoginRequest): PostLoginResponse {
    const adminAccount = process.env.adminAccount;
    const adminPassword = process.env.adminPassword;

    if (body.account !== adminAccount || body.password !== adminPassword)
      throw new UnauthorizedError('unauthorized');

    const today = format(new Date(), 'yyyy/MM/dd');

    return { secret: encrypt(today) };
  }
}
