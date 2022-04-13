import {
  DbBase,
  DbService,
  entity,
  ModelBase,
  primaryAttribute,
  relatedAttributeMany,
} from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { Status } from 'src/constant/Trip';

export type Trip = DbBase & {
  id: string;
  topic: string;
  ad: string;
  content: string;
  date: string;
  region: string;
  meetTime: string;
  meetPlace: string;
  dismissTime: string;
  dismissPlace: string;
  fee: number;
  other?: string;

  ownerName: string;
  ownerPhone: string;
  ownerLine?: string;

  code: string;
  status: Status;
  expiredDate?: string;
  notifyDate?: string;
  reason?: string;

  signId?: string[];
};

/**
 * Entity class for Trip
 */
@entity('trip')
class TripEntity implements Trip {
  @primaryAttribute()
  public id: string;
  public topic: string;
  public ad: string;
  public content: string;
  public date: string;
  public region: string;
  public meetTime: string;
  public meetPlace: string;
  public dismissTime: string;
  public dismissPlace: string;
  public fee: number;
  public other?: string;

  public ownerName: string;
  public ownerPhone: string;
  public ownerLine?: string;

  public code: string;
  public status: Status;
  public expiredDate?: string;
  public notifyDate?: string;
  public reason?: string;

  @relatedAttributeMany('sign')
  public signId?: string[];

  public dateCreated?: number;
  public dateUpdated?: number;
  public dateDeleted?: number;

  constructor(input: Trip) {
    this.id = input.id;
    this.topic = input.topic;
    this.ad = input.ad;
    this.content = input.content;
    this.date = input.date;
    this.region = input.region;
    this.meetTime = input.meetTime;
    this.meetPlace = input.meetPlace;
    this.dismissTime = input.dismissTime;
    this.dismissPlace = input.dismissPlace;
    this.fee = input.fee;
    this.other = input.other;
    this.ownerName = input.ownerName;
    this.ownerPhone = input.ownerPhone;
    this.ownerLine = input.ownerLine;
    this.code = input.code;
    this.status = input.status;
    this.expiredDate = input.expiredDate;
    this.notifyDate = input.notifyDate;
    this.reason = input.reason;
    this.signId = input.signId;
    this.dateCreated = input.dateCreated;
    this.dateUpdated = input.dateUpdated;
    this.dateDeleted = input.dateDeleted;
  }
}

@injectable()
export class TripModel implements ModelBase {
  @inject(DbService)
  private readonly dbService!: DbService;
  private alias = 'trip';

  async find(id: string) {
    return await this.dbService.getItem<Trip>(this.alias, id);
  }

  async findAll() {
    return await this.dbService.getItems<Trip>(this.alias);
  }

  async create(data: Trip): Promise<void> {
    await this.dbService.createItem<Trip>(
      new TripEntity({
        ...data,
        dateCreated: Date.now(),
      })
    );
  }

  async replace(data: Trip): Promise<void> {
    await this.dbService.putItem<Trip>(
      new TripEntity({
        ...data,
        dateUpdated: Date.now(),
      })
    );
  }

  async softDelete(id: string): Promise<void> {
    const trip = await this.find(id);
    await this.replace({ ...trip, dateDeleted: Date.now() });
  }

  async hardDelete(id: string): Promise<void> {
    await this.dbService.deleteItem(this.alias, id);
  }
}
