import {
  DbService,
  InternalServerError,
  UnauthorizedError,
} from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import {
  GetTripsDetailResponse,
  GetTripsIdResponse,
  GetTripsIdSign,
  GetTripsResponse,
  PostTripsRequest,
  PutTripsIdMember,
  PutTripsIdVerifyRequest,
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

    return trips
      .map((v) => ({
        id: v.id,
        topic: v.topic,
        date: v.date,
        ownerName: v.ownerName,
        ownerPhone: v.ownerPhone,
        ownerLine: v.ownerLine,
        code: v.code,
        status: v.status,
        signs: v.signId ? v.signId.length : 0,
        dateCreated: v.dateCreated,
        dateUpdated: v.dateUpdated,
      }))
      .sort(compareKey('dateCreated', true));
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
    const newSign = new SignEntity({
      id: uuidv4(),
      name: body.name,
      phone: body.phone,
      line: body.line,
      yearOfBirth: body.yearOfBirth,
      isSelf: body.forWho === 'self',
      accompany:
        body.accompany === undefined ? undefined : body.accompany === 'yes',
      status: 'pending',
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    });
    const trip = await this.dbService.getItem<Trip>('trip', id);
    await this.dbService.createItem<Sign>(newSign);
    await this.dbService.putItem<Trip>(
      new TripEntity({
        ...trip,
        signId: [...(trip.signId ?? []), newSign.id],
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

  public async deleteTripById(id: string) {
    try {
      const trip = await this.dbService.getItem<Trip>('trip', id);
      await this.dbService.deleteItem('trip', trip.id);
      await Promise.all(
        (trip.signId ?? []).map((id) => this.dbService.deleteItem('sign', id))
      );
    } catch {
      throw new InternalServerError(`delete trip ${id} fail`);
    }
  }

  public async verifyTrip(id: string, body: PutTripsIdVerifyRequest) {
    const trip = await this.dbService.getItem<Trip>('trip', id);

    let updatedTrip: Trip;
    if (body.pass === 'yes')
      updatedTrip = {
        ...trip,
        status: 'pass',
        expiredDate: body.expiredDate,
        notifyDate: body.notifyDate,
      };
    else
      updatedTrip = {
        ...trip,
        status: 'reject',
        reason: body.reason,
      };
    await this.dbService.putItem<Trip>(new TripEntity(updatedTrip));
  }

  public async getSigns(id: string, code: string): Promise<GetTripsIdSign> {
    const trip = await this.dbService.getItem<Trip>('trip', id);
    if (code !== trip.code) throw new UnauthorizedError('wrong code');
    if (trip.signId === undefined) return [];

    return await Promise.all(
      trip.signId.map((id) => this.dbService.getItem<Sign>('sign', id))
    );
  }

  public async reviseMember(id: string, body: PutTripsIdMember) {
    const trip = await this.dbService.getItem<Trip>('trip', id);
    await Promise.all(
      (trip.signId ?? []).map(async (v) => {
        const sign = await this.dbService.getItem<Sign>('sign', v);
        await this.dbService.putItem<Sign>(
          new SignEntity({
            ...sign,
            status: body.signId.includes(v) ? 'bingo' : 'sorry',
          })
        );
      })
    );
  }
}
