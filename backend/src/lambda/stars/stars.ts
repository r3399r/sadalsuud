import {
  errorOutput,
  LambdaContext,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/User';
import { StarService } from 'src/logic/StarService';
import { UserService } from 'src/logic/UserService';
import { PostStarRequest, PostStarResponse } from 'src/model/Star';
import { StarsEvent } from './StarsEvent';

export async function stars(
  event: StarsEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const userService: UserService = bindings.get<UserService>(UserService);
    const starService: StarService = bindings.get<StarService>(StarService);

    let res: PostStarResponse;

    switch (event.httpMethod) {
      case 'POST':
        if (event.body === null) throw new Error('null body error');

        await userService.validateRole(
          event.headers['x-api-token'],
          ROLE.ADMIN
        );

        res = await starService.addStar(
          JSON.parse(event.body) as PostStarRequest
        );
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
