import {
  errorOutput,
  LambdaContext,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/User';
import { TripService } from 'src/logic/TripService';
import {
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
import { TripsEvent } from './TripsEvent';

export async function trips(
  event: TripsEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const tripService: TripService = bindings.get<TripService>(TripService);

    let res:
      | PostTripResponse
      | GetTripsResponse
      | GetTripResponse
      | VerifyTripResponse
      | ReviseTripResponse
      | SetTripMemberResponse
      | SignTripResponse;

    switch (event.httpMethod) {
      case 'POST':
        if (event.body === null) throw new Error('null body error');

        if (event.resource === '/api/trips')
          res = await tripService.registerTrip(
            JSON.parse(event.body) as PostTripRequest,
            event.headers['x-api-token']
          );
        else if (event.resource === '/api/trips/{id}/sign') {
          if (event.pathParameters === null)
            throw new Error('trip id is missing');
          res = await tripService.signTrip(
            event.pathParameters.id,
            JSON.parse(event.body) as SignTripRequest,
            event.headers['x-api-token']
          );
        } else throw new Error('unsupported resource');
        break;
      case 'GET':
        if (event.pathParameters === null)
          res = await tripService.getTrips(event.headers['x-api-token']);
        else
          res = await tripService.getTrip(
            event.headers['x-api-token'],
            event.pathParameters.id
          );
        break;
      case 'PUT':
        if (event.body === null) throw new Error('null body error');
        if (event.pathParameters === null)
          throw new Error('trip id is missing');
        if (event.resource === '/api/trips/{id}')
          res = await tripService.reviseTrip(
            event.pathParameters.id,
            JSON.parse(event.body) as ReviseTripRequest,
            event.headers['x-api-token']
          );
        else if (event.resource === '/api/trips/{id}/verify') {
          await tripService.validateRole(event.headers['x-api-token'], [
            ROLE.ADMIN,
          ]);

          res = await tripService.verifyTrip(
            event.pathParameters.id,
            JSON.parse(event.body) as VerifyTripRequest
          );
        } else if (event.resource === '/api/trips/{id}/member') {
          await tripService.validateRole(event.headers['x-api-token'], [
            ROLE.ADMIN,
          ]);

          res = await tripService.setTripMember(
            event.pathParameters.id,
            JSON.parse(event.body) as SetTripMemberRequest
          );
        } else throw new Error('unsupported resource');
        break;
      default:
        throw new Error('unknown http method');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}
