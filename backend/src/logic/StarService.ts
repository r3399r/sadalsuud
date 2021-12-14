import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { ALIAS } from 'src/constant';
import { PostStarRequest, StarEntity } from 'src/model/Star';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service class for CRUD stars
 */
@injectable()
export class StarService {
  @inject(DbService)
  private readonly dbService!: DbService;

  public async addStar(body: PostStarRequest) {
    const star = new StarEntity({
      id: uuidv4(),
      name: body.name,
      nickname: body.nickname,
      birthday: body.birthday,
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    });

    await this.dbService.createItem(ALIAS, star);

    return star;
  }

  public async removeStar(id: string) {
    await this.dbService.deleteItem(ALIAS, 'star', id);
  }
}
