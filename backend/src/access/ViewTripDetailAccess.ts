import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
import { ViewTripDetail } from 'src/model/viewEntity/ViewTripDetail';
import { ViewTripDetailEntity } from 'src/model/viewEntity/ViewTripDetailEntity';
import { Database } from 'src/util/database';

/**
 * Access class for ViewTripDetail model.
 */
@injectable()
export class ViewTripDetailAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findMany(options?: FindManyOptions<ViewTripDetail>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewTripDetail>(
      ViewTripDetailEntity.name,
      options
    );
  }
}
