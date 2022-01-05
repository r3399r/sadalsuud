import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { ALIAS } from 'src/constant';
import { PostTripRequest, TripEntity } from 'src/model/Trip';
import { User, UserEntity } from 'src/model/User';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service class for Trips
 */
@injectable()
export class TripService {
  @inject(DbService)
  private readonly dbService!: DbService;

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
}
