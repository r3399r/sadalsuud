import { NotFoundError, UnauthorizedError } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { LessThan, MoreThanOrEqual, Not } from 'typeorm';
import { SignAccess } from 'src/access/SignAccess';
import { TripAccess } from 'src/access/TripAccess';
import { ViewTripDetailAccess } from 'src/access/ViewTripDetailAccess';
import { Status } from 'src/constant/Trip';
import {
  GetTripsDetailResponse,
  GetTripsIdResponse,
  GetTripsIdSign,
  GetTripsResponse,
  PostTripsRequest,
  PutTripsIdMemberRequest,
  PutTripsIdRequest,
  PutTripsIdResponse,
  PutTripsIdVerifyRequest,
  PutTripsSignRequest,
} from 'src/model/api/Trip';
import { SignEntity } from 'src/model/entity/SignEntity';
import { Trip } from 'src/model/entity/Trip';
import { TripEntity } from 'src/model/entity/TripEntity';
import { gen6DigitCode } from 'src/util/codeGenerator';

/**
 * Service class for Trips
 */
@injectable()
export class TripService {
  @inject(TripAccess)
  private readonly tripAccess!: TripAccess;

  @inject(SignAccess)
  private readonly signAccess!: SignAccess;

  @inject(ViewTripDetailAccess)
  private readonly viewTripDetailAccess!: ViewTripDetailAccess;

  public async registerTrip(body: PostTripsRequest) {
    const trip = new TripEntity();
    trip.topic = body.topic;
    trip.ad = body.ad;
    trip.content = body.content;
    trip.region = body.region;
    trip.date = new Date(body.date);
    trip.meetDate = new Date(body.meetDate);
    trip.meetPlace = body.meetPlace;
    trip.dismissDate = new Date(body.dismissDate);
    trip.dismissPlace = body.dismissPlace;
    trip.fee = body.fee;
    trip.other = body.other ?? null;
    trip.ownerName = body.ownerName;
    trip.ownerPhone = body.ownerPhone;
    trip.ownerLine = body.ownerLine ?? null;
    trip.code = gen6DigitCode();
    trip.status = Status.Pending;

    await this.tripAccess.save(trip);
  }

  public async getSimplifiedTrips(): Promise<GetTripsResponse> {
    const now = new Date();

    const [futureTrips, pastTrips] = await Promise.all([
      this.tripAccess.findMany({
        where: [
          { status: Not(Status.Pass) },
          { expiredDate: MoreThanOrEqual(now) },
        ],
        order: { meetDate: 'asc' },
      }),
      this.tripAccess.findMany({
        where: { status: Status.Pass, expiredDate: LessThan(now) },
        order: { meetDate: 'desc' },
      }),
    ]);

    const trips = [...futureTrips, ...pastTrips];

    return trips.map((v) => {
      const common = {
        id: v.id,
        topic: v.topic,
        date: v.date.toISOString(),
        ownerName: v.ownerName,
        dateCreated: v.dateCreated.toISOString(),
        dateUpdated: v.dateUpdated ? v.dateUpdated.toISOString() : null,
      };
      if (v.status === Status.Pass)
        return {
          ...common,
          status: v.status,
          ad: v.ad,
          meetDate: v.meetDate.toISOString(),
          dismissDate: v.dismissDate.toISOString(),
          region: v.region,
          fee: v.fee,
          other: v.other,
          expiredDate: v.expiredDate ? v.expiredDate.toISOString() : null,
          notifyDate: v.notifyDate ? v.notifyDate.toISOString() : null,
        };
      else if (v.status === Status.Reject)
        return {
          ...common,
          status: v.status,
          reason: v.reason,
        };

      return {
        ...common,
        status: v.status,
      };
    });
  }

  public async getDetailedTrips(): Promise<GetTripsDetailResponse> {
    const trips = await this.viewTripDetailAccess.findMany({
      order: { date: 'desc' },
    });

    return trips.map((v) => ({
      id: v.id,
      topic: v.topic,
      date: v.date.toISOString(),
      ownerName: v.ownerName,
      ownerPhone: v.ownerPhone,
      ownerLine: v.ownerLine,
      code: v.code,
      status: v.status,
      signs: Number(v.count),
      dateCreated: v.dateCreated.toISOString(),
      dateUpdated: v.dateUpdated ? v.dateUpdated.toISOString() : null,
    }));
  }

  public async signTrip(id: string, body: PutTripsSignRequest) {
    const trip = await this.tripAccess.findById(id);
    if (trip === null) throw new NotFoundError();

    const sign = new SignEntity();
    sign.name = body.name;
    sign.phone = body.phone;
    sign.line = body.line ?? null;
    sign.birthYear = body.birthYear;
    sign.isSelf = body.forWho === 'self';
    sign.accompany =
      body.accompany === undefined ? null : body.accompany === 'yes';
    sign.tripId = trip.id;

    await this.signAccess.save(sign);
  }

  public async getDetailedTrip(id: string): Promise<GetTripsIdResponse> {
    const trip = await this.tripAccess.findById(id);
    if (trip === null) throw new NotFoundError();

    return {
      id: trip.id,
      topic: trip.topic,
      ad: trip.ad,
      content: trip.content,
      date: trip.date.toISOString(),
      region: trip.region,
      meetDate: trip.meetDate.toISOString(),
      meetPlace: trip.meetPlace,
      dismissPlace: trip.dismissPlace,
      dismissDate: trip.dismissDate.toISOString(),
      fee: trip.fee,
      other: trip.other,
      ownerName: trip.ownerName,
      status: trip.status,
      dateCreated: trip.dateCreated.toISOString(),
      dateUpdated: trip.dateUpdated ? trip.dateUpdated.toISOString() : null,
    };
  }

  public async modifyTrip(
    id: string,
    body: PutTripsIdRequest
  ): Promise<PutTripsIdResponse> {
    const trip = await this.tripAccess.findById(id);
    if (trip === null) throw new NotFoundError();

    const newTrip: Trip = {
      ...trip,
      topic: body.topic,
      ad: body.ad,
      content: body.content,
      meetDate: new Date(body.meetDate),
      dismissDate: new Date(body.dismissDate),
      region: body.region,
      meetPlace: body.meetPlace,
      dismissPlace: body.dismissPlace,
      fee: body.fee,
      other: body.other ?? null,
    };

    await this.tripAccess.save(newTrip);

    return {
      id: newTrip.id,
      topic: newTrip.topic,
      ad: newTrip.ad,
      content: newTrip.content,
      date: newTrip.date.toISOString(),
      region: newTrip.region,
      meetDate: newTrip.meetDate.toISOString(),
      meetPlace: newTrip.meetPlace,
      dismissPlace: newTrip.dismissPlace,
      dismissDate: newTrip.dismissDate.toISOString(),
      fee: newTrip.fee,
      other: newTrip.other,
      ownerName: newTrip.ownerName,
      status: newTrip.status,
      dateCreated: newTrip.dateCreated.toISOString(),
      dateUpdated: newTrip.dateUpdated
        ? newTrip.dateUpdated.toISOString()
        : null,
    };
  }

  public async deleteTripById(id: string) {
    await this.tripAccess.hardDeleteById(id);
  }

  public async verifyTrip(id: string, body: PutTripsIdVerifyRequest) {
    const trip = await this.tripAccess.findById(id);
    if (trip === null) throw new NotFoundError();

    let updatedTrip: Trip;
    if (body.pass === 'yes')
      updatedTrip = {
        ...trip,
        status: Status.Pass,
        expiredDate: new Date(body.expiredDate),
        notifyDate: new Date(body.notifyDate),
      };
    else
      updatedTrip = {
        ...trip,
        status: Status.Reject,
        reason: body.reason,
      };
    await this.tripAccess.save(updatedTrip);
  }

  public async getSigns(id: string, code: string): Promise<GetTripsIdSign> {
    const trip = await this.tripAccess.findById(id);
    if (trip === null) throw new NotFoundError();
    if (code !== trip.code) throw new UnauthorizedError('wrong code');

    return await this.signAccess.findMany({
      where: { tripId: id },
      order: { dateCreated: 'ASC' },
    });
  }

  public async reviseMember(id: string, body: PutTripsIdMemberRequest) {
    const signs = await this.signAccess.findMany({ where: { tripId: id } });

    for (const sign of signs)
      await this.signAccess.save({
        ...sign,
        canJoin: body.signId.includes(sign.id),
      });
  }
}
