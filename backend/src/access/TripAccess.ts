import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Trip } from 'src/model/entity/Trip';
import { TripEntity } from 'src/model/entity/TripEntity';
import { Database } from 'src/util/database';

/**
 * Access class for Trip model.
 */
@injectable()
export class TripAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneBy<Trip>(TripEntity.name, { id });
  }

  public async findOne(options: FindOneOptions<Trip>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<Trip>(TripEntity.name, options);
  }

  public async findMany(options?: FindManyOptions<Trip>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Trip>(TripEntity.name, options);
  }

  public async save(trip: Trip) {
    const qr = await this.database.getQueryRunner();
    const entity = new TripEntity();
    Object.assign(entity, trip);

    return await qr.manager.save(entity);
  }

  public async hardDeleteById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.delete(TripEntity.name, id);
  }
}
