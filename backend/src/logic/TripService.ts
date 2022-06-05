import { UnauthorizedError } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { Status } from 'src/constant/Trip';
import {
  GetTripsDetailResponse,
  GetTripsIdResponse,
  GetTripsIdSign,
  GetTripsResponse,
  PostTripsRequest,
  PutTripsIdMember,
  PutTripsIdRequest,
  PutTripsIdResponse,
  PutTripsIdVerifyRequest,
  PutTripsSignRequest,
} from 'src/model/api/Trip';
import { Sign, SignModel } from 'src/model/entity/Sign';
import { Trip, TripModel } from 'src/model/entity/Trip';
import { gen6DigitCode } from 'src/util/codeGenerator';
import { compareKey } from 'src/util/compare';

/**
 * Service class for Trips
 */
@injectable()
export class TripService {
  @inject(TripModel)
  private readonly tripModel!: TripModel;

  @inject(SignModel)
  private readonly signModel!: SignModel;

  public async registerTrip(body: PostTripsRequest) {
    await this.tripModel.create({
      ...body,
      id: uuidv4(),
      code: gen6DigitCode(),
      status: Status.Pending,
    });
  }

  public async getSimplifiedTrips(): Promise<GetTripsResponse> {
    const trips = await this.tripModel.findAll();

    const res = trips.map((v) => {
      const common = {
        id: v.id,
        topic: v.topic,
        date: v.date,
        ownerName: v.ownerName,
        dateCreated: v.dateCreated,
        dateUpdated: v.dateUpdated,
      };
      if (v.status === Status.Pass)
        return {
          ...common,
          status: v.status,
          ad: v.ad,
          meetTime: v.meetTime,
          dismissTime: v.dismissTime,
          region: v.region,
          fee: v.fee,
          other: v.other,
          expiredDate: v.expiredDate,
          notifyDate: v.notifyDate,
        };
      if (v.status === Status.Reject)
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

    return [
      ...res
        .filter(
          (v) =>
            v.status !== Status.Pass ||
            new Date(v.expiredDate ?? 0) >= new Date()
        )
        .sort(compareKey<GetTripsResponse[0]>('date', false)),
      ...res
        .filter(
          (v) =>
            v.status === Status.Pass &&
            new Date(v.expiredDate ?? 0) < new Date()
        )
        .sort(compareKey<GetTripsResponse[0]>('date', true)),
    ];
  }

  public async getDetailedTrips(): Promise<GetTripsDetailResponse> {
    const trips = await this.tripModel.findAll();

    const detailedTrips = await Promise.all(
      trips.map(async (v) => {
        const sign = await this.signModel.findByTripId(v.id);

        return {
          id: v.id,
          topic: v.topic,
          date: v.date,
          ownerName: v.ownerName,
          ownerPhone: v.ownerPhone,
          ownerLine: v.ownerLine,
          code: v.code,
          status: v.status,
          signs: sign.length,
          dateCreated: v.dateCreated,
          dateUpdated: v.dateUpdated,
        };
      })
    );

    return detailedTrips.sort(
      compareKey<GetTripsDetailResponse[0]>('dateCreated', true)
    );
  }

  public async signTrip(id: string, body: PutTripsSignRequest) {
    const newSign: Sign = {
      id: uuidv4(),
      name: body.name,
      phone: body.phone,
      line: body.line,
      yearOfBirth: body.yearOfBirth,
      isSelf: body.forWho === 'self',
      accompany:
        body.accompany === undefined ? undefined : body.accompany === 'yes',
      status: 'pending',
      tripId: id,
    };
    await this.signModel.create(newSign);
  }

  public async getDetailedTrip(id: string): Promise<GetTripsIdResponse> {
    const trip = await this.tripModel.find(id);

    return {
      id: trip.id,
      topic: trip.topic,
      ad: trip.ad,
      content: trip.content,
      date: trip.date,
      region: trip.region,
      meetTime: trip.meetTime,
      meetPlace: trip.meetPlace,
      dismissPlace: trip.dismissPlace,
      dismissTime: trip.dismissTime,
      fee: trip.fee,
      other: trip.other,
      ownerName: trip.ownerName,
      status: trip.status,
      dateCreated: trip.dateCreated,
      dateUpdated: trip.dateUpdated,
    };
  }

  public async modifyTrip(
    id: string,
    body: PutTripsIdRequest
  ): Promise<PutTripsIdResponse> {
    const trip = await this.tripModel.find(id);
    const newTrip: Trip = { ...trip, ...body };
    await this.tripModel.replace(newTrip);

    return newTrip;
  }

  public async deleteTripById(id: string) {
    await this.tripModel.hardDelete(id);
  }

  public async verifyTrip(id: string, body: PutTripsIdVerifyRequest) {
    const trip = await this.tripModel.find(id);

    let updatedTrip: Trip;
    if (body.pass === 'yes')
      updatedTrip = {
        ...trip,
        status: Status.Pass,
        expiredDate: body.expiredDate,
        notifyDate: body.notifyDate,
      };
    else
      updatedTrip = {
        ...trip,
        status: Status.Reject,
        reason: body.reason,
      };
    await this.tripModel.replace(updatedTrip);
  }

  public async getSigns(id: string, code: string): Promise<GetTripsIdSign> {
    const trip = await this.tripModel.find(id);
    if (code !== trip.code) throw new UnauthorizedError('wrong code');

    const signs = await this.signModel.findByTripId(id);

    return signs.sort(compareKey<GetTripsIdSign[0]>('dateCreated', true));
  }

  public async reviseMember(id: string, body: PutTripsIdMember) {
    const signs = await this.signModel.findByTripId(id);
    await Promise.all(
      signs.map((v) =>
        this.signModel.replace({
          ...v,
          status: body.signId.includes(v.id) ? 'bingo' : 'sorry',
        })
      )
    );
  }
}
