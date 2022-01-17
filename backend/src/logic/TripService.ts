import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import moment from 'moment';
import { ROLE } from 'src/constant/User';
import { Group } from 'src/model/Group';
import { Sign, SignEntity } from 'src/model/Sign';
import { Star } from 'src/model/Star';
import {
  GetTripResponse,
  GetTripsResponse,
  PostTripRequest,
  ReviseTripRequest,
  SetTripMemberRequest,
  SignTripRequest,
  Trip,
  TripEntity,
  VerifyTripRequest,
} from 'src/model/Trip';
import { User } from 'src/model/User';
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

  public async validateRole(token: string, specificRole: ROLE[]) {
    return await this.userService.validateRole(token, specificRole);
  }

  public async registerTrip(body: PostTripRequest, token: string) {
    const user = await this.validateRole(token, [
      ROLE.ADMIN,
      ROLE.SOFT_PLANNER,
      ROLE.GOOD_PLANNER,
    ]);
    const trip = new TripEntity({
      ...body,
      id: uuidv4(),
      verified: false,
      expiredDatetime: null,
      owner: user,
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    });

    await this.dbService.createItem(trip);

    return trip;
  }

  public async getTrip(
    token: string,
    tripId: string
  ): Promise<GetTripResponse> {
    const user = await this.userService.getUserByToken(token);
    const trip = await this.dbService.getItem<Trip>('trip', tripId);

    if (user.role === ROLE.ADMIN) return trip;
    else if (
      [
        ROLE.GOOD_PARTNER,
        ROLE.GOOD_PLANNER,
        ROLE.ROOKIE,
        ROLE.SOFT_PARTNER,
        ROLE.SOFT_PLANNER,
      ].includes(user.role)
    )
      return {
        ...trip,
        owner: { id: trip.owner.id, name: trip.owner.name },
        participant: trip.participant?.map((p: User) => ({
          id: p.id,
          name: p.name,
        })),
        star: trip.star?.map((s: Star) => ({ id: s.id, nickname: s.nickname })),
      };
    else
      return {
        ...trip,
        startDatetime: moment(trip.startDatetime).startOf('day').valueOf(),
        endDatetime: moment(trip.endDatetime).endOf('day').valueOf(),
        meetPlace: '********',
        dismissPlace: '********',
        detailDesc: '********',
        owner: { id: trip.owner.id, name: trip.owner.name },
        participant: trip.participant?.map((p: User) => ({
          id: p.id,
          name: p.name,
        })),
        star: trip.star?.map((s: Star) => ({ id: s.id, nickname: s.nickname })),
      };
  }

  public async getTrips(token: string): Promise<GetTripsResponse> {
    const user = await this.userService.getUserByToken(token);
    const trips = await this.dbService.getItems<Trip>('trip');

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

  public async verifyTrip(tripId: string, body: VerifyTripRequest) {
    const oldTrip = await this.dbService.getItem<Trip>('trip', tripId);
    const newTrip = new TripEntity({
      ...oldTrip,
      verified: true,
      expiredDatetime: body.expiredDatetime,
    });
    await this.dbService.putItem(newTrip);

    return newTrip;
  }

  public async reviseTrip(
    tripId: string,
    body: ReviseTripRequest,
    token: string
  ) {
    const getOldTrip = this.dbService.getItem<Trip>('trip', tripId);
    const getUser = this.userService.getUserByToken(token);
    const [oldTrip, user] = await Promise.all([getOldTrip, getUser]);

    if (oldTrip.owner.id !== user.id && user.role !== ROLE.ADMIN)
      throw new Error('permission denied');

    const revisedTrip = new TripEntity({
      ...oldTrip,
      ...body,
      dateUpdated: Date.now(),
    });

    await this.dbService.putItem(revisedTrip);

    return revisedTrip;
  }

  public async setTripMember(tripId: string, body: SetTripMemberRequest) {
    const getTrip = this.dbService.getItem<Trip>('trip', tripId);
    const getParticipant = Promise.all(
      body.participantId.map((userId: string) =>
        this.dbService.getItem<User>('user', userId)
      )
    );
    const getStar = Promise.all(
      body.starId.map((starId: string) =>
        this.dbService.getItem<Star>('star', starId)
      )
    );
    const getSign = this.dbService.getItemsByIndex<Sign>(
      'sign',
      'trip',
      tripId
    );
    const [trip, participant, star, sign] = await Promise.all([
      getTrip,
      getParticipant,
      getStar,
      getSign,
    ]);

    // group without star means it is volunteer
    const signedParticipantIds = sign
      .filter((s: Sign) => s.group.star === undefined)
      .map((s: Sign) => {
        if (s.group.user.length !== 1)
          throw new Error('volunteer group should only have 1 user');

        return s.group.user[0].id;
      });
    // group with star means it is star group
    const signedStarIds = sign
      .filter((s: Sign) => s.group.star !== undefined)
      .map((s: Sign) => s.group.star!.id);

    // check input participants/stars have all signed this trip
    if (
      !body.participantId.every((v: string) => signedParticipantIds.includes(v))
    )
      throw new Error('some of input participants did not sign this trip');
    if (!body.starId.every((v: string) => signedStarIds.includes(v)))
      throw new Error('some of input stars did not sign this trip');

    const newTrip = new TripEntity({
      ...trip,
      participant,
      star,
    });
    const newSign = sign
      // group w/o star means it is volunteer or it is star related group
      .filter((s: Sign) =>
        s.group.star === undefined
          ? body.participantId.includes(s.group.user[0].id)
          : body.starId.includes(s.group.star.id)
      )
      .map((v: Sign) => new SignEntity({ ...v, result: true }));

    await Promise.all([
      this.dbService.putItem(newTrip),
      ...newSign.map((v: Sign) => this.dbService.putItem(v)),
    ]);

    return newTrip;
  }

  public async getSignByTrip(tripId: string) {
    return await this.dbService.getItemsByIndex<Sign>('sign', 'trip', tripId);
  }

  public async signTrip(tripId: string, body: SignTripRequest, token: string) {
    const validateUser = this.validateRole(token, [
      ROLE.ADMIN,
      ROLE.GOOD_PARTNER,
      ROLE.SOFT_PARTNER,
      ROLE.GOOD_PLANNER,
      ROLE.SOFT_PLANNER,
    ]);
    const getTrip = this.dbService.getItem<Trip>('trip', tripId);
    const [user, trip] = await Promise.all([validateUser, getTrip]);
    if (user.id === trip.owner.id)
      throw new Error('You cannot sign a trip whose owner is yourself.');

    const getGroup = this.dbService.getItem<Group>('group', body.groupId);
    const [group, currentSigns] = await Promise.all([
      getGroup,
      this.getSignByTrip(trip.id),
    ]);
    if (currentSigns.map((v: Sign) => v.group.id).includes(group.id))
      throw new Error('You have already signed this trip before.');

    const sign = new SignEntity({
      id: uuidv4(),
      trip,
      group,
      result: false,
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    });

    await this.dbService.createItem(sign);

    return sign;
  }
}
