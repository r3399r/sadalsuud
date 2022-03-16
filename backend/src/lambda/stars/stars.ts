import {
  BadRequestError,
  errorOutput,
  InternalServerError,
  LambdaContext,
  LambdaEvent,
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

async function apiStars(event: LambdaEvent, service: StarService) {
  await service.validateRole(event.headers['x-api-token'], [ROLE.ADMIN]);

  switch (event.httpMethod) {
    case 'GET':
      return await service.getStars();
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.addStar(JSON.parse(event.body) as PostStarRequest);
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiStarsRecord(event: LambdaEvent, service: StarService) {
  if (event.body === null)
    throw new BadRequestError('body should not be empty');

  await service.validateRole(event.headers['x-api-token'], [ROLE.ADMIN]);

  switch (event.httpMethod) {
    case 'POST':
      return await service.addRecord(
        JSON.parse(event.body) as PostRecordRequest
      );
    case 'PUT':
      return await service.editRecord(
        JSON.parse(event.body) as PutRecordRequest
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiStarsId(event: LambdaEvent, service: StarService) {
  if (event.pathParameters === null)
    throw new BadRequestError('star id is required');

  switch (event.httpMethod) {
    case 'DELETE':
      await service.validateRole(event.headers['x-api-token'], [ROLE.ADMIN]);
      await service.removeStar(event.pathParameters.id);

      return;
    case 'GET':
      await service.validateRole(event.headers['x-api-token'], [
        ROLE.ADMIN,
        ROLE.SOFT_PARTNER,
        ROLE.SOFT_PLANNER,
      ]);

      return await service.getStarDetail(event.pathParameters.id);
    default:
      throw new InternalServerError('unknown http method');
  }
}

export async function stars(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const service: StarService = bindings.get<StarService>(StarService);

    let res:
      | PostStarResponse
      | void
      | GetStarsResponse
      | GetStarResponse
      | PostRecordResponse
      | PutRecordResponse;

    switch (event.resource) {
      case '/api/stars':
        res = await apiStars(event, service);
        break;
      case '/api/stars/record':
        res = await apiStarsRecord(event, service);
        break;
      case '/api/stars/{id}':
        res = await apiStarsId(event, service);
        break;
      default:
        throw new InternalServerError('unknown resource');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
