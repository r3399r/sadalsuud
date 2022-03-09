import {
  ConflictError,
  DbService,
  UnauthorizedError,
} from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import moment from 'moment';
import { ROLE } from 'src/constant/user';
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
import { GroupService } from './GroupService';
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

    if (user.role === ROLE.ADMIN)
      return {
        ...trip,
        ...GroupService.convertGroup(trip.joinedGroup ?? []),
      };
    else if (
      [
        ROLE.GOOD_PARTNER,
        ROLE.GOOD_PLANNER,
        ROLE.ROOKIE,
        ROLE.SOFT_PARTNER,
        ROLE.SOFT_PLANNER,
      ].includes(user.role)
    ) {
      const { volunteer, star } = GroupService.convertGroup(
        trip.joinedGroup ?? []
      );

      return {
        ...trip,
        owner: { id: trip.owner.id, name: trip.owner.name },
        volunteer: volunteer.map((o: User) => ({ id: o.id, name: o.name })),
        star: star.map((s: Star) => ({ id: s.id, nickname: s.nickname })),
      };
    } else {
      const { volunteer, star } = GroupService.convertGroup(
        trip.joinedGroup ?? []
      );

      return {
        ...trip,
        startDatetime: moment(trip.startDatetime).startOf('day').valueOf(),
        endDatetime: moment(trip.endDatetime).endOf('day').valueOf(),
        meetPlace: '********',
        dismissPlace: '********',
        detailDesc: '********',
        owner: { id: trip.owner.id, name: trip.owner.name },
        volunteer: volunteer.map((o: User) => ({ id: o.id, name: o.name })),
        star: star.map((s: Star) => ({ id: s.id, nickname: s.nickname })),
      };
    }
  }

  public async getTrips(token: string): Promise<GetTripsResponse> {
    const user = await this.userService.getUserByToken(token);
    const trips = await this.dbService.getItems<Trip>('trip');

    if (user.role === ROLE.ADMIN)
      return trips.map((v: Trip) => ({
        ...v,
        ...GroupService.convertGroup(v.joinedGroup ?? []),
      }));
    else if (
      [
        ROLE.GOOD_PARTNER,
        ROLE.GOOD_PLANNER,
        ROLE.SOFT_PARTNER,
        ROLE.SOFT_PLANNER,
      ].includes(user.role)
    )
      return trips
        .filter((v: Trip) => v.verified === true)
        .map((v: Trip) => {
          const { volunteer, star } = GroupService.convertGroup(
            v.joinedGroup ?? []
          );

          return {
            ...v,
            owner: { id: v.owner.id, name: v.owner.name },
            volunteer: volunteer.map((o: User) => ({ id: o.id, name: o.name })),
            star: star.map((s: Star) => ({ id: s.id, nickname: s.nickname })),
          };
        });
    else
      return trips
        .filter((v: Trip) => v.verified === true)
        .map((v: Trip) => {
          const { volunteer, star } = GroupService.convertGroup(
            v.joinedGroup ?? []
          );

          return {
            ...v,
            startDatetime: moment(v.startDatetime).startOf('day').valueOf(),
            endDatetime: moment(v.endDatetime).endOf('day').valueOf(),
            meetPlace: '********',
            dismissPlace: '********',
            detailDesc: '********',
            owner: { id: v.owner.id, name: v.owner.name },
            volunteer: volunteer.map((o: User) => ({ id: o.id, name: o.name })),
            star: star.map((s: Star) => ({ id: s.id, nickname: s.nickname })),
          };
        });
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
      throw new UnauthorizedError('permission denied');

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
    const getGroup = Promise.all(
      body.groupId.map((id: string) =>
        this.dbService.getItem<Group>('group', id)
      )
    );
    const getSign = this.dbService.getItemsByIndex<Sign>(
      'sign',
      'trip',
      tripId
    );
    const [trip, group, sign] = await Promise.all([getTrip, getGroup, getSign]);

    // check input group have all signed this trip
    if (
      !body.groupId.every((v: string) =>
        sign.map((o: Sign) => o.group.id).includes(v)
      )
    )
      throw new ConflictError('some of input groups did not sign this trip');

    const newTrip = new TripEntity({
      ...trip,
      joinedGroup: group,
    });
    const newSign = sign
      .filter((s: Sign) => body.groupId.includes(s.group.id))
      .map((v: Sign) => new SignEntity({ ...v, result: true }));

    await Promise.all([
      this.dbService.putItem(newTrip),
      ...newSign.map((v: Sign) => this.dbService.putItem(v)),
    ]);

    return newTrip;
  }

  private async getSignByTrip(tripId: string) {
    return await this.dbService.getItemsByIndex<Sign>('sign', 'trip', tripId);
  }

  public async getSignedList(tripId: string, token: string) {
    const [user, trip] = await Promise.all([
      this.userService.getUserByToken(token),
      this.dbService.getItem<Trip>('trip', tripId),
    ]);
    if (user.role !== ROLE.ADMIN && trip.owner.id !== user.id)
      throw new UnauthorizedError('permission denied');

    return await this.getSignByTrip(trip.id);
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
      throw new ConflictError(
        'You cannot sign a trip whose owner is yourself.'
      );

    const getGroup = this.dbService.getItem<Group>('group', body.groupId);
    const [group, currentSigns] = await Promise.all([
      getGroup,
      this.getSignByTrip(trip.id),
    ]);
    if (currentSigns.map((v: Sign) => v.group.id).includes(group.id))
      throw new ConflictError('You have already signed this trip before.');

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
