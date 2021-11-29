import { inject, injectable } from 'inversify';
import { LineService } from './LineService';

/**
 * Service class to validate line user
 */
@injectable()
export class AuthService {
  @inject(LineService)
  private readonly lineService!: LineService;

  public async validate(token: string) {
    await this.lineService.verifyToken(token);
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
