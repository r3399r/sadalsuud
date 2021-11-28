import axios from 'axios';
import { injectable } from 'inversify';

/**
 * Service class to validate line user
 */
@injectable()
export class AuthService {
  public async validate(token: string) {
    await axios.get(
      `https://api.line.me/oauth2/v2.1/verify?access_token=${token}`
    );
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
