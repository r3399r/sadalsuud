import {
  errorOutput,
  LambdaContext,
  LambdaOutput,
  successOutput,
} from '@y-celestial/service';
import { bindings } from 'src/bindings';
import { ROLE } from 'src/constant/User';
import { TripService } from 'src/logic/TripService';
import { UserService } from 'src/logic/UserService';
import { PostTripRequest, PostTripResponse } from 'src/model/Trip';
import { TripsEvent } from './TripsEvent';

export async function trips(
  event: TripsEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  try {
    const userService: UserService = bindings.get<UserService>(UserService);
    const tripService: TripService = bindings.get<TripService>(TripService);

    let res: PostTripResponse;

    const user = await userService.validateRole(event.headers['x-api-token'], [
      ROLE.ADMIN,
      ROLE.SOFT_PLANNER,
      ROLE.GOOD_PLANNER,
    ]);

    switch (event.httpMethod) {
      case 'POST':
        if (event.body === null) throw new Error('null body error');

        res = await tripService.registerTrip(
          JSON.parse(event.body) as PostTripRequest,
          user
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
