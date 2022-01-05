import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import moment from 'moment';
import { ALIAS } from 'src/constant';
import { ROLE } from 'src/constant/User';
import { Star } from 'src/model/Star';
import {
  GetTripResponse,
  PostTripRequest,
  Trip,
  TripEntity,
} from 'src/model/Trip';
import { User, UserEntity } from 'src/model/User';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from './UserService';

/**
 * Service class for Trips
 */
@injectable()
export class TripService {
  @inject(DbService)
  private readonly dbService!: DbService;

  @inject(UserService)
  private readonly userService!: UserService;

  public async registerTrip(body: PostTripRequest, user: User) {
    const trip = new TripEntity({
      ...body,
      id: uuidv4(),
      verified: false,
      expiredDatetime: null,
      owner: new UserEntity(user),
      participant: [],
      star: [],
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    });

    await this.dbService.createItem(ALIAS, trip);

    return trip;
  }

  public async getTrips(token: string): Promise<GetTripResponse> {
    const user = await this.userService.getUserByToken(token);
    const trips = await this.dbService.getItems<Trip>(ALIAS, 'trip');

    if (user.role === ROLE.ADMIN) return trips;
    else if (
      [
        ROLE.GOOD_PARTNER,
        ROLE.GOOD_PLANNER,
        ROLE.ROOKIE,
        ROLE.SOFT_PARTNER,
        ROLE.SOFT_PLANNER,
      ].includes(user.role)
    )
      return trips
        .filter((v: Trip) => v.verified === true)
        .map((v: Trip) => ({
          ...v,
          owner: { id: v.owner.id, name: v.owner.name },
          participant: v.participant?.map((p: User) => ({
            id: p.id,
            name: p.name,
          })),
          star: v.star?.map((s: Star) => ({ id: s.id, nickname: s.nickname })),
        }));
    else
      return trips
        .filter((v: Trip) => v.verified === true)
        .map((v: Trip) => ({
          ...v,
          startDatetime: moment(v.startDatetime).startOf('day').valueOf(),
          endDatetime: moment(v.endDatetime).endOf('day').valueOf(),
          meetPlace: '********',
          dismissPlace: '********',
          detailDesc: '********',
          owner: { id: v.owner.id, name: v.owner.name },
          participant: v.participant?.map((p: User) => ({
            id: p.id,
            name: p.name,
          })),
          star: v.star?.map((s: Star) => ({ id: s.id, nickname: s.nickname })),
        }));
  }
}
