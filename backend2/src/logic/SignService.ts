import { DbService } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { PutSignIdRequest } from 'src/model/api/Sign';
import { Sign, SignEntity } from 'src/model/entity/Sign';

/**
 * Service class for Sign
 */
@injectable()
export class SignService {
  @inject(DbService)
  private readonly dbService!: DbService;

  public async modifyComment(id: string, body: PutSignIdRequest) {
    const sign = await this.dbService.getItem<Sign>('sign', id);
    await this.dbService.putItem<Sign>(
      new SignEntity({
        ...sign,
        comment: body.comment,
        dateUpdated: Date.now(),
      })
    );
  }
}
