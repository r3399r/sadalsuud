import { InternalServerError, UnauthorizedError } from '@y-celestial/service';
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

    return trips
      .map((v) => {
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
      })
      .sort(compareKey('dateCreated', true));
  }

  public async getDetailedTrips(): Promise<GetTripsDetailResponse> {
    const trips = await this.tripModel.findAll();

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
      .sort(compareKey<GetTripsDetailResponse[0]>('dateCreated', true));
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
    };
    const trip = await this.tripModel.find(id);
    await this.signModel.create(newSign);
    await this.tripModel.replace({
      ...trip,
      signId: [...(trip.signId ?? []), newSign.id],
    });
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
    try {
      const trip = await this.tripModel.find(id);
      await this.tripModel.hardDelete(id);
      await Promise.all(
        (trip.signId ?? []).map((signId) => this.signModel.hardDelete(signId))
      );
    } catch {
      throw new InternalServerError(`delete trip ${id} fail`);
    }
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
    if (trip.signId === undefined) return [];

    return await Promise.all(
      trip.signId.map((signId) => this.signModel.find(signId))
    );
  }

  public async reviseMember(id: string, body: PutTripsIdMember) {
    const trip = await this.tripModel.find(id);
    await Promise.all(
      (trip.signId ?? []).map(async (signId) => {
        const sign = await this.signModel.find(signId);
        await this.signModel.replace({
          ...sign,
          status: body.signId.includes(signId) ? 'bingo' : 'sorry',
        });
      })
    );
  }
}
