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
import { PostTripsRequest } from 'src/model/api/Trip';

export async function trips(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const service: TripService = bindings.get<TripService>(TripService);

    let res: void;

    switch (event.resource) {
      case '/api/trips':
        res = await apiTrips(event, service);
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
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      await service.registerTrip(JSON.parse(event.body) as PostTripsRequest);

      return;
    default:
      throw new InternalServerError('unknown http method');
  }
}
