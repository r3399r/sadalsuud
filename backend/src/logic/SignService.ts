import { inject, injectable } from 'inversify';
import { PutSignIdRequest } from 'src/model/api/Sign';
import { SignModel } from 'src/model/entity/Sign';

/**
 * Service class for Sign
 */
@injectable()
export class SignService {
  @inject(SignModel)
  private readonly signModel!: SignModel;

  public async modifyComment(id: string, body: PutSignIdRequest) {
    const sign = await this.signModel.find(id);
    await this.signModel.replace({ ...sign, comment: body.comment });
  }
}
