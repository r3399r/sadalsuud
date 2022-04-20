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
import { TripService } from 'src/logic/TripService';
import {
  GetTripsDetailResponse,
  GetTripsIdResponse,
  GetTripsIdSign,
  GetTripsResponse,
  PostTripsRequest,
  PutTripsIdMember,
  PutTripsIdVerifyRequest,
  PutTripsSignRequest,
} from 'src/model/api/Trip';

export async function trips(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const service: TripService = bindings.get<TripService>(TripService);

    let res:
      | void
      | GetTripsResponse
      | GetTripsIdResponse
      | GetTripsDetailResponse
      | GetTripsIdSign;

    switch (event.resource) {
      case '/api/trips':
        res = await apiTrips(event, service);
        break;
      case '/api/trips/detail':
        res = await apiTripsDetail(event, service);
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

async function apiTrips(event: LambdaEvent, service: TripService) {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getSimplifiedTrips();
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      await service.registerTrip(JSON.parse(event.body) as PostTripsRequest);

      return;
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiTripsDetail(event: LambdaEvent, service: TripService) {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getDetailedTrips();
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiTripsId(event: LambdaEvent, service: TripService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      return await service.getDetailedTrip(event.pathParameters.id);
    case 'DELETE':
      await service.deleteTripById(event.pathParameters.id);

      return;
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiTripsIdMember(event: LambdaEvent, service: TripService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.reviseMember(
        event.pathParameters.id,
        JSON.parse(event.body) as PutTripsIdMember
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiTripsIdSign(event: LambdaEvent, service: TripService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      if (event.queryStringParameters === null)
        throw new BadRequestError('queryStringParameters should not be empty');

      return await service.getSigns(
        event.pathParameters.id,
        event.queryStringParameters.code
      );
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      await service.signTrip(
        event.pathParameters.id,
        JSON.parse(event.body) as PutTripsSignRequest
      );

      return;
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiTripsIdVerify(event: LambdaEvent, service: TripService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      await service.verifyTrip(
        event.pathParameters.id,
        JSON.parse(event.body) as PutTripsIdVerifyRequest
      );

      return;
    default:
      throw new InternalServerError('unknown http method');
  }
}
