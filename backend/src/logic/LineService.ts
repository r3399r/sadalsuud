import axios from 'axios';
import { injectable } from 'inversify';
import { GetProfileResponse, VerifyTokenResponse } from 'src/model/Line';

/**
 * Service class for line apis
 */
@injectable()
export class LineService {
  public async verifyToken(token: string) {
    const res = await axios.get<VerifyTokenResponse>(
      `https://api.line.me/oauth2/v2.1/verify?access_token=${token}`
    );

    return res.data;
  }

  public async getProfile(token: string) {
    const res = await axios.get<GetProfileResponse>(
      'https://api.line.me/v2/profile',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  }
}
