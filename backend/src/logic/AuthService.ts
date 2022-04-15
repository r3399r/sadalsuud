import { UnauthorizedError } from '@y-celestial/service';
import { format } from 'date-fns';
import { injectable } from 'inversify';
import { PostLoginRequest, PostLoginResponse } from 'src/model/api/Login';
import { decrypt, encrypt } from 'src/util/crypto';

/**
 * Service class to auth
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

  public validate(secret: string) {
    const answer = format(new Date(), 'yyyy/MM/dd');
    const input = decrypt(secret);

    if (answer !== input) throw new UnauthorizedError();
  }

  public authResponse(pass: boolean, resource: string) {
    return {
      principalId: 'celestial-sadalsuud-auth-principal',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: pass ? 'Allow' : 'Deny',
            Resource: resource,
          },
        ],
      },
    };
  }
}
