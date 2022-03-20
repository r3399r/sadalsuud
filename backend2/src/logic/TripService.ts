import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { PostTripsRequest } from 'src/model/api/Trip';
import { TripEntity } from 'src/model/Trip';

/**
 * Service class for Trips
 */
@injectable()
export class TripService {
  @inject(DbService)
  private readonly dbService!: DbService;

  public async registerTrip(body: PostTripsRequest) {
    const trip = new TripEntity({
      ...body,
      id: uuidv4(),
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    });

    await this.dbService.createItem(trip);
  }
}
