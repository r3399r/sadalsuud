import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { ALIAS } from 'src/constant';
import { GetMeResponse } from 'src/model/Me';
import { Trip } from 'src/model/Trip';
import { UserService } from './UserService';

/**
 * Service class for me
 */
@injectable()
export class MeService {
  @inject(DbService)
  private readonly dbService!: DbService;

  @inject(UserService)
  private readonly userService!: UserService;

  public async getMe(token: string): Promise<GetMeResponse> {
    const user = await this.userService.getUserByToken(token);
    const trips = await this.dbService.getItemsByIndex<Trip>(
      ALIAS,
      'trip',
      'user',
      user.id
    );

    return {
      ...user,
      myTrips: trips,
    };
  }
}
