import { NotFoundError } from '@y-celestial/service';
import { inject, injectable } from 'inversify';
import { SignAccess } from 'src/access/SignAccess';
import { PutSignIdRequest } from 'src/model/api/Sign';

/**
 * Service class for Sign
 */
@injectable()
export class SignService {
  @inject(SignAccess)
  private readonly signAccess!: SignAccess;

  public async cleanup() {
    await this.signAccess.cleanup();
  }

  public async modifyComment(id: string, body: PutSignIdRequest) {
    const sign = await this.signAccess.findById(id);
    if (sign === null) throw new NotFoundError();
    await this.signAccess.save({ ...sign, comment: body.comment });
  }

  public async deleteSign(id: string) {
    await this.signAccess.hardDeleteById(id);
  }
}
