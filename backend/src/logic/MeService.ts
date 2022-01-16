import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { ALIAS } from 'src/constant';
import { Group } from 'src/model/Group';
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
    const [trip, group] = await Promise.all([
      this.dbService.getItemsByIndex<Trip>(ALIAS, 'trip', 'user', user.id),
      this.dbService.getItemsByIndex<Group>(ALIAS, 'group', 'user', user.id),
    ]);

    return {
      ...user,
      myTrip: trip.filter((v: Trip) => v.owner.id === user.id),
      joinedTrip: trip.filter((v: Trip) => v.owner.id !== user.id),
      myGroup: group,
    };
  }
}
