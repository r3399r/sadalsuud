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
import {
  PostRecordRequest,
  PostRecordResponse,
  PutRecordRequest,
  PutRecordResponse,
} from 'src/model/Record';
import {
  GetStarResponse,
  GetStarsResponse,
  PostStarRequest,
  PostStarResponse,
} from 'src/model/Star';
import { StarsEvent } from './StarsEvent';

export async function stars(
  event: StarsEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const starService: StarService = bindings.get<StarService>(StarService);

    let res:
      | PostStarResponse
      | void
      | GetStarsResponse
      | GetStarResponse
      | PostRecordResponse
      | PutRecordResponse;

    switch (event.httpMethod) {
      case 'GET':
        if (event.pathParameters === null) {
          await starService.validateRole(event.headers['x-api-token'], [
            ROLE.ADMIN,
          ]);
          res = await starService.getStars();
        } else {
          await starService.validateRole(event.headers['x-api-token'], [
            ROLE.ADMIN,
            ROLE.SOFT_PARTNER,
            ROLE.SOFT_PLANNER,
          ]);
          res = await starService.getStarDetail(event.pathParameters.id);
        }
        break;
      case 'POST':
        if (event.body === null)
          throw new BadRequestError('body should not be empty');

        await starService.validateRole(event.headers['x-api-token'], [
          ROLE.ADMIN,
        ]);
        if (event.resource === '/api/stars')
          res = await starService.addStar(
            JSON.parse(event.body) as PostStarRequest
          );
        else if (event.resource === '/api/stars/record')
          res = await starService.addRecord(
            JSON.parse(event.body) as PostRecordRequest
          );
        else throw new InternalServerError('non-support resource');
        break;
      case 'PUT':
        if (event.body === null)
          throw new BadRequestError('body should not be empty');

        await starService.validateRole(event.headers['x-api-token'], [
          ROLE.ADMIN,
        ]);
        if (event.resource === '/api/stars/record')
          res = await starService.editRecord(
            JSON.parse(event.body) as PutRecordRequest
          );
        else throw new InternalServerError('non-support resource');
        break;
      case 'DELETE':
        if (event.pathParameters === null)
          throw new BadRequestError('star id is required');

        await starService.validateRole(event.headers['x-api-token'], [
          ROLE.ADMIN,
        ]);
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
