import {
  DbBase,
  DbService,
  entity,
  ModelBase,
  primaryAttribute,
} from '@y-celestial/service';
import { inject, injectable } from 'inversify';

export type Sign = DbBase & {
  id: string;
  name: string;
  phone: string;
  line?: string;
  yearOfBirth: string;
  isSelf: boolean;
  accompany?: boolean;

  status: 'bingo' | 'sorry' | 'pending';
  comment?: string;
};

/**
 * Entity class for Sign
 */
@entity('sign')
class SignEntity implements Sign {
  @primaryAttribute()
  public id: string;
  public name: string;
  public phone: string;
  public line?: string;
  public yearOfBirth: string;
  public isSelf: boolean;
  public accompany?: boolean;

  public status: 'bingo' | 'sorry' | 'pending';
  public comment?: string;

  public dateCreated?: number;
  public dateUpdated?: number;
  public dateDeleted?: number;

  constructor(input: Sign) {
    this.id = input.id;
    this.name = input.name;
    this.phone = input.phone;
    this.line = input.line;
    this.yearOfBirth = input.yearOfBirth;
    this.isSelf = input.isSelf;
    this.accompany = input.accompany;
    this.status = input.status;
    this.comment = input.comment;
    this.dateCreated = input.dateCreated;
    this.dateUpdated = input.dateUpdated;
    this.dateDeleted = input.dateDeleted;
  }
}

@injectable()
export class SignModel implements ModelBase {
  @inject(DbService)
  private readonly dbService!: DbService;
  private alias = 'sign';

  async find(id: string) {
    return await this.dbService.getItem<Sign>(this.alias, id);
  }

  async findAll() {
    return await this.dbService.getItems<Sign>(this.alias);
  }

  async create(data: Sign): Promise<void> {
    await this.dbService.createItem<Sign>(
      new SignEntity({
        ...data,
        dateCreated: Date.now(),
      })
    );
  }

  async replace(data: Sign): Promise<void> {
    await this.dbService.putItem<Sign>(
      new SignEntity({
        ...data,
        dateUpdated: Date.now(),
      })
    );
  }

  async softDelete(id: string): Promise<void> {
    const sign = await this.find(id);
    await this.replace({ ...sign, dateDeleted: Date.now() });
  }

  async hardDelete(id: string): Promise<void> {
    await this.dbService.deleteItem(this.alias, id);
  }
}
