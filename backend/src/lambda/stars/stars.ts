import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/user';
import { StarService } from 'src/logic/StarService';
import { PostStarRequest, PostStarResponse } from 'src/model/Star';
import { StarsEvent } from './StarsEvent';

export async function stars(
  event: StarsEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const starService: StarService = bindings.get<StarService>(StarService);

    let res: PostStarResponse | void;

    await starService.validateRole(event.headers['x-api-token'], [ROLE.ADMIN]);

    switch (event.httpMethod) {
      case 'POST':
        if (event.body === null)
          throw new BadRequestError('body should not be empty');

        res = await starService.addStar(
          JSON.parse(event.body) as PostStarRequest
        );
        break;
      case 'DELETE':
        if (event.pathParameters === null)
          throw new BadRequestError('star id is required');

        res = await starService.removeStar(event.pathParameters.id);
        break;
      default:
        throw new InternalServerError('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
