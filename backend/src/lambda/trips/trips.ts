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
import { TripService } from 'src/logic/TripService';
import {
  GetSignResponse,
  GetTripResponse,
  GetTripsResponse,
  PostTripRequest,
  PostTripResponse,
  ReviseTripRequest,
  ReviseTripResponse,
  SetTripMemberRequest,
  SetTripMemberResponse,
  SignTripRequest,
  SignTripResponse,
  VerifyTripRequest,
  VerifyTripResponse,
} from 'src/model/Trip';

async function apiTrips(event: LambdaEvent, service: TripService) {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getTrips(event.headers['x-api-token']);
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.registerTrip(
        JSON.parse(event.body) as PostTripRequest,
        event.headers['x-api-token']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiTripsId(event: LambdaEvent, service: TripService) {
  if (event.pathParameters === null)
    throw new BadRequestError('trip id is missing');
  switch (event.httpMethod) {
    case 'GET':
      return await service.getTrip(
        event.headers['x-api-token'],
        event.pathParameters.id
      );
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.reviseTrip(
        event.pathParameters.id,
        JSON.parse(event.body) as ReviseTripRequest,
        event.headers['x-api-token']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiTripsIdMember(event: LambdaEvent, service: TripService) {
  if (event.pathParameters === null)
    throw new BadRequestError('trip id is missing');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');
      await service.validateRole(event.headers['x-api-token'], [ROLE.ADMIN]);

      return await service.setTripMember(
        event.pathParameters.id,
        JSON.parse(event.body) as SetTripMemberRequest
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiTripsIdSign(event: LambdaEvent, service: TripService) {
  if (event.pathParameters === null)
    throw new BadRequestError('trip id is missing');
  switch (event.httpMethod) {
    case 'GET':
      return await service.getSignedList(
        event.pathParameters.id,
        event.headers['x-api-token']
      );
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.signTrip(
        event.pathParameters.id,
        JSON.parse(event.body) as SignTripRequest,
        event.headers['x-api-token']
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiTripsIdVerify(event: LambdaEvent, service: TripService) {
  if (event.pathParameters === null)
    throw new BadRequestError('trip id is missing');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');
      await service.validateRole(event.headers['x-api-token'], [ROLE.ADMIN]);

      return await service.verifyTrip(
        event.pathParameters.id,
        JSON.parse(event.body) as VerifyTripRequest
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

export async function trips(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const service: TripService = bindings.get<TripService>(TripService);

    let res:
      | PostTripResponse
      | GetTripsResponse
      | GetTripResponse
      | VerifyTripResponse
      | ReviseTripResponse
      | SetTripMemberResponse
      | SignTripResponse
      | GetSignResponse;

    switch (event.resource) {
      case '/api/trips':
        res = await apiTrips(event, service);
        break;
      case '/api/trips/{id}':
        res = await apiTripsId(event, service);
        break;
      case '/api/trips/{id}/member':
        res = await apiTripsIdMember(event, service);
        break;
      case '/api/trips/{id}/sign':
        res = await apiTripsIdSign(event, service);
        break;
      case '/api/trips/{id}/verify':
        res = await apiTripsIdVerify(event, service);
        break;
      default:
        throw new InternalServerError('unknown resource');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
