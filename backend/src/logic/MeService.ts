import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { Group } from 'src/model/Group';
import { GetMeResponse } from 'src/model/Me';
import { Sign } from 'src/model/Sign';
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
      this.dbService.getItemsByIndex<Trip>('trip', 'user', user.id),
      this.dbService.getItemsByIndex<Group>('group', 'user', user.id),
    ]);

    const myTrip = trip.map((v: Trip) => {
      const { owner, ...rest } = v;

      return rest;
    });

    const myGroup = await Promise.all(
      group.map(async (v: Group) => {
        const sign = await this.dbService.getItemsByIndex<Sign>(
          'sign',
          'group',
          v.id
        );

        return {
          group: v,
          signedTrip: sign.map((s: Sign) => {
            const { owner, joinedGroup, ...rest } = s.trip;

            return {
              ...rest,
              owner: { id: owner.id, name: owner.name },
              result: s.result,
            };
          }),
        };
      })
    );

    return {
      ...user,
      myTrip,
      myGroup,
    };
  }
}
