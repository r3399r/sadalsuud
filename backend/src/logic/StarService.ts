import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { ROLE } from 'src/constant/user';
import { PostStarRequest, Star, StarEntity } from 'src/model/Star';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from './UserService';

/**
 * Service class for CRUD stars
 */
@injectable()
export class StarService {
  @inject(DbService)
  private readonly dbService!: DbService;

  @inject(UserService)
  private readonly userService!: UserService;

  public async validateRole(token: string, specificRole: ROLE[]) {
    await this.userService.validateRole(token, specificRole);
  }

  public async addStar(body: PostStarRequest) {
    const star = new StarEntity({
      id: uuidv4(),
      name: body.name,
      nickname: body.nickname,
      birthday: body.birthday,
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    });

    await this.dbService.createItem(star);

    return star;
  }

  public async removeStar(id: string) {
    await this.dbService.deleteItem('star', id);
  }

  public async getStar(id: string) {
    return await this.dbService.getItem<Star>('star', id);
  }
}
