import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
import { Sign } from 'src/model/entity/Sign';
import { SignEntity } from 'src/model/entity/SignEntity';
import { Database } from 'src/util/database';

/**
 * Access class for Sign model.
 */
@injectable()
export class SignAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneBy<Sign>(SignEntity.name, { id });
  }

  public async save(sign: Sign) {
    const qr = await this.database.getQueryRunner();
    const entity = new SignEntity();
    Object.assign(entity, sign);

    return await qr.manager.save(entity);
  }

  public async findMany(options?: FindManyOptions<Sign>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Sign>(SignEntity.name, options);
  }

  public async hardDeleteById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.delete(SignEntity.name, id);
  }

  public async cleanup() {
    await this.database.cleanUp();
  }
}
