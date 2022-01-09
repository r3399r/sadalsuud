import {
  errorOutput,
  LambdaContext,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/User';
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
        if (event.body === null) throw new Error('null body error');

        res = await starService.addStar(
          JSON.parse(event.body) as PostStarRequest
        );
        break;
      case 'DELETE':
        if (event.pathParameters === null)
          throw new Error('star id is required');

        res = await starService.removeStar(event.pathParameters.id);
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
