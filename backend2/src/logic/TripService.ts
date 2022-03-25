import { BadRequestError, DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import {
  GetTripsDetailResponse,
  GetTripsIdResponse,
  GetTripsResponse,
  PostTripsRequest,
  PutTripsSignRequest,
} from 'src/model/api/Trip';
import { Sign, SignEntity } from 'src/model/entity/Sign';
import { Trip, TripEntity } from 'src/model/entity/Trip';
import { gen6DigitCode } from 'src/util/codeGenerator';
import { compareKey } from 'src/util/compare';

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
      code: gen6DigitCode(),
      status: 'pending',
      sign: [],
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    });

    await this.dbService.createItem(trip);
  }

  public async getSimplifiedTrips(): Promise<GetTripsResponse> {
    const trips = await this.dbService.getItems<Trip>('trip');

    return trips
      .map((v) => ({
        id: v.id,
        topic: v.topic,
        ad: v.ad,
        date: v.date,
        period: this.getPeriod(v.meetTime, v.dismissTime),
        region: v.region,
        fee: v.fee,
        other: v.other,
        dateCreated: v.dateCreated,
        dateUpdated: v.dateUpdated,
      }))
      .sort(compareKey('dateCreated', true));
  }

  public async getDetailedTrips(): Promise<GetTripsDetailResponse> {
    const trips = await this.dbService.getItems<Trip>('trip');

    return trips.sort(compareKey('dateCreated', true));
  }

  private getPeriod(
    meetTime: string,
    dismissTime: string
  ): GetTripsResponse[0]['period'] {
    const start = Number(meetTime.split(':')[0]);
    const end = Number(dismissTime.split(':')[0]);

    if (start < 12 && end < 12) return 'morning';
    if (start < 12 && end >= 18) return 'allday';
    if (start >= 12 && end < 18) return 'afternoon';
    if (start >= 18 && end >= 18) return 'evening';
    if (start >= 12 && end >= 18) return 'pm';

    return 'daytime';
  }

  public async signTrip(id: string, body: PutTripsSignRequest) {
    if (body.forWho === 'kid' && body.accompany === undefined)
      throw new BadRequestError('accompany should not be empty');
    const newSign = new SignEntity({
      id: uuidv4(),
      name: body.name,
      phone: body.phone,
      line: body.line,
      yearOfBirth: body.yearOfBirth,
      isSelf: body.forWho === 'self',
      accompany:
        body.accompany === undefined ? undefined : body.accompany === 'yes',
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    });
    const trip = await this.dbService.getItem<Trip>('trip', id);
    await this.dbService.createItem<Sign>(newSign);
    await this.dbService.putItem<Trip>(
      new TripEntity({
        ...trip,
        sign: [...(trip.sign ?? []), newSign],
        dateUpdated: Date.now(),
      })
    );
  }

  public async getTripForAttendee(id: string): Promise<GetTripsIdResponse> {
    const trip = await this.dbService.getItem<Trip>('trip', id);

    return {
      id: trip.id,
      topic: trip.topic,
      content: trip.content,
      date: trip.date,
      meetTime: trip.meetTime,
      meetPlace: trip.meetPlace,
      dismissTime: trip.dismissTime,
      dismissPlace: trip.dismissPlace,
      fee: trip.fee,
      other: trip.other,
      dateCreated: trip.dateCreated,
      dateUpdated: trip.dateUpdated,
    };
  }
}